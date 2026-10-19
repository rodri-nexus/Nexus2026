// public/nevux-widget.js 
(function () {
  "use strict";

  const API_BASE = "https://nevux.ar";
  const NS = "nevux-widget";

  console.log("[Nevux] v28 - Multi-Widget Engine Active");

  /* ═══════════════════════════════════════════
     NUBESDK & LEGACY HYBRID ADAPTER
  ═══════════════════════════════════════════ */
  window.NubeSDK = window.NubeSDK || null;

  function initNubeSDKIntegration(sdk) {
    if (!sdk) return;
    try {
      if (typeof sdk.subscribe === "function") {
        sdk.subscribe("cart:updated", function (cartData) {
          if (typeof initAllWidgets === "function") initAllWidgets();
        });
        sdk.subscribe("product:rendered", function (productData) {
          if (typeof initAllWidgets === "function") initAllWidgets();
        });
        sdk.subscribe("page:rendered", function (pageData) {
          if (typeof initAllWidgets === "function") initAllWidgets();
        });
      }
    } catch (err) {
      console.error("[Nevux] NubeSDK error:", err);
    }
  }

  // 1. EJECUCIÓN INMEDIATA MODO LEGADO JS (Sin esperar a NubeSDK)
  if (typeof initAllWidgets === "function") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        initAllWidgets();
      });
    } else {
      initAllWidgets();
    }
  }

  // 2. SOPORTE ADICIONAL NUBESDK (Si estuviera presente o si llega después)
  if (window.NubeSDK) {
    initNubeSDKIntegration(window.NubeSDK);
  } else {
    document.addEventListener("nubeSDKReady", function (e) {
      var sdk = (e && e.detail) ? e.detail : window.NubeSDK;
      initNubeSDKIntegration(sdk);
    });
}
/* ═══════════════════════════════════════════
     HELPERS
  ═══════════════════════════════════════════ */

  const qs = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  function splitEmoji(str) {
    if (!str) return { emoji: "", text: "" };
    const s = str.trim();
    let emojiEnd = 0;
    for (let i = 0; i < s.length && i < 4; i++) {
      const code = s.charCodeAt(i);
      if (code >= 0xD800 && code <= 0xDBFF) {
        emojiEnd = i + 2;
      } else if (code > 0x2000 && code !== 0x20) {
        emojiEnd = i + 1;
      } else if (emojiEnd > 0) {
        break;
      } else {
        break;
      }
    }
    if (emojiEnd > 0) {
      return { emoji: s.substring(0, emojiEnd), text: s.substring(emojiEnd).trim() };
    }
    return { emoji: "", text: s };
  }

      function detectStoreId() {
    try {
      if (window.NEVUX_STORE_ID) return parseInt(window.NEVUX_STORE_ID, 10);
      if (window.Store && (window.Store.id || window.Store.store_id))
        return parseInt(window.Store.id || window.Store.store_id, 10);
      if (window.LS && window.LS.store && window.LS.store.id) return parseInt(window.LS.store.id, 10);
      if (window.LS && window.LS.storeId) return parseInt(window.LS.storeId, 10);
      if (window.LS && window.LS.store && typeof window.LS.store === 'number') return window.LS.store;
      if (window.__NUVEMSHOP_STORE__ && window.__NUVEMSHOP_STORE__.id)
        return parseInt(window.__NUVEMSHOP_STORE__.id, 10);
      if (window.Tiendanube && window.Tiendanube.storeId) return parseInt(window.Tiendanube.storeId, 10);

      // 1. DETECCIÓN DIRECTA DESDE LAS ETIQUETAS <SCRIPT>
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].src || '';
        if (src) {
          var matchStore = src.match(/[?&](?:store|store_id|storeId)=(\d+)/i);
          if (matchStore && matchStore[1]) {
            return parseInt(matchStore[1], 10);
          }
        }
      }

      // 2. DETECCIÓN DESDE META TAGS
      var metaSelectors = [
        'meta[name="store-id"]',
        'meta[name="store_id"]',
        'meta[property="store_id"]',
        'meta[name="store"]'
      ];
      for (var j = 0; j < metaSelectors.length; j++) {
        var metaEl = typeof qs === 'function' ? qs(metaSelectors[j]) : document.querySelector(metaSelectors[j]);
        if (metaEl && metaEl.content) {
          var metaVal = parseInt(metaEl.content, 10);
          if (!isNaN(metaVal) && metaVal > 0) return metaVal;
        }
      }

      // 3. DETECCIÓN DESDE ATRIBUTOS DATA EN HTML/BODY
      if (document.documentElement && document.documentElement.dataset) {
        if (document.documentElement.dataset.storeId) return parseInt(document.documentElement.dataset.storeId, 10);
        if (document.documentElement.dataset.store) return parseInt(document.documentElement.dataset.store, 10);
      }
      if (document.body && document.body.dataset) {
        if (document.body.dataset.storeId) return parseInt(document.body.dataset.storeId, 10);
        if (document.body.dataset.store) return parseInt(document.body.dataset.store, 10);
      }

      // 4. DETECCIÓN DESDE LINKS DE CDN/ASSETS
      var assetLink = typeof qs === 'function' ? qs('link[href*="/stores/"]') : document.querySelector('link[href*="/stores/"]');
      if (assetLink) {
        var cdnMatch = assetLink.href.match(/\/stores\/(\d+)/);
        if (cdnMatch && cdnMatch[1]) return parseInt(cdnMatch[1], 10);
      }

      // 5. DETECCIÓN POR REGEX EN EL HTML
      var html = (document.documentElement && document.documentElement.innerHTML) ? document.documentElement.innerHTML : '';
      var m = html.match(/"store_id":\s*(\d+)/) || html.match(/"storeId":\s*(\d+)/) || html.match(/LS\.store\s*=\s*{\s*id:\s*(\d+)/);
      if (m && m[1]) return parseInt(m[1], 10);

      // 6. DETECCIÓN POR PARÁMETROS DE LA URL DE LA PÁGINA
      var urlMatch = window.location.search.match(/[?&](?:store_id|store|storeId)=(\d+)/i);
      if (urlMatch && urlMatch[1]) return parseInt(urlMatch[1], 10);

    } catch (e) {
      console.error("[Nevux] Error detectando storeId:", e);
    }
    return null;
  }

  function detectProductId() {
    if (window.NEVUX_PRODUCT_ID) return window.NEVUX_PRODUCT_ID;
    if (window.Product) return window.Product.id;
    if (window.LS && window.LS.product && window.LS.product.id) return window.LS.product.id;
    var meta = qs('meta[property="og:product:id"]');
    if (meta) return meta.content;
    var m = document.location.pathname.match(/\/productos\/[^/]+-(\d+)/);
    if (m) return parseInt(m[1], 10);
    var html = (document.documentElement && document.documentElement.innerHTML) ? document.documentElement.innerHTML : '';
    var pm = html.match(/"product_id":\s*(\d+)/);
    if (pm) return parseInt(pm[1], 10);
    return null;
  }

  function detectProductPrice() {
    if (window.Product && window.Product.price) return parseFloat(window.Product.price);
    if (window.LS && window.LS.product && window.LS.product.price) {
      return parseFloat(window.LS.product.price);
    }
    var priceEl = qs('[data-store="product-price"]') ||
                    qs('.js-price-display') ||
                    qs('.price-display') ||
                    qs('span[itemprop="price"]');
    if (priceEl) {
      var txt = priceEl.textContent || priceEl.getAttribute("content") || "";
      var num = parseFloat(txt.replace(/[^\d,\.]/g, "").replace(/\./g, "").replace(",", "."));
      if (!isNaN(num)) return num;
    }
    return null;
        }

  function detectPageType() {
    const path = document.location.pathname.toLowerCase().replace(/\/$/, "");
    if (path === "" || path === "/home" || path === "/inicio") return "home";
    if (path.indexOf("/productos/") >= 0 || path.indexOf("/products/") >= 0) return "product";
    if (path.indexOf("/carrito") >= 0 || path.indexOf("/cart") >= 0) return "cart";
    return "other";
  }

  function formatMoney(n) {
    if (n === null || n === undefined || isNaN(n)) return "$****";
    try {
      return "$" + n.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    } catch (e) {
      return "$" + n.toFixed(2);
    }
  }
  
  /* ═══════════════════════════════════════════
     INYECTOR GLOBAL DE ESTILOS Y ANIMACIONES NEVUX
  ═══════════════════════════════════════════ */
  function injectNevuxGlobalStyles() {
    if (document.getElementById("nevux-global-styles")) return;
    var styleEl = document.createElement("style");
    styleEl.id = "nevux-global-styles";
    styleEl.innerHTML = `
      @keyframes nvxLightSweep {
        0% { transform: translateX(-150%) skewX(-20deg); }
        25%, 100% { transform: translateX(250%) skewX(-20deg); }
      }
      @keyframes nvxAureolaPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4), 0 4px 12px rgba(0, 0, 0, 0.04); }
        50% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0), 0 6px 20px rgba(16, 185, 129, 0.18); }
      }
      @keyframes nvxZoom {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.03); }
      }
      @keyframes nvxBounceBadge {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.12); }
      }
      @keyframes nvxTruckDrive {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(2px); }
      }
      @keyframes nvxSpeedTrail {
        0% { transform: translateX(-100%); opacity: 0; }
        50% { opacity: 0.6; }
        100% { transform: translateX(100%); opacity: 0; }
      }
      @keyframes nvxBorderSnake {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes nvxProgressBarFlow {
        0% { background-position: 0 0; }
        100% { background-position: 30px 0; }
      }
      @keyframes nvxPulseHit {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.12); }
      }
      @keyframes nvxRetroFlip {
        0% { transform: scaleY(1); opacity: 1; }
        40%,60% { transform: scaleY(0); opacity: 0.5; }
        100% { transform: scaleY(1); opacity: 1; }
      }
      @keyframes nvxCriticalPulse {
        0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.6); }
        50% { transform: scale(1.05); box-shadow: 0 0 0 8px rgba(220, 38, 38, 0); }
      }
      @keyframes nvxShieldGlow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.3); }
        50% { box-shadow: 0 0 10px 2px rgba(16, 185, 129, 0.15); }
      }
      @keyframes nvxTrailPulse {
        0% { left: -50%; }
        100% { left: 100%; }
      }
    `;
    (document.head || document.documentElement).appendChild(styleEl);
  }
  injectNevuxGlobalStyles();
  function formatMoneyInt(n) {
    if (n === null || n === undefined || isNaN(n)) return "$0";
    try {
      return "$" + Math.round(n).toLocaleString("es-AR");
    } catch (e) {
      return "$" + Math.round(n);
    }
  }

  /* ═══════════════════════════════════════════
     DETECTAR SUBTOTAL DEL CARRITO
  ═══════════════════════════════════════════ */
  function detectCartSubtotal() {
    if (window.LS && window.LS.cart) {
      if (typeof window.LS.cart.subtotal === "number") return window.LS.cart.subtotal;
      if (typeof window.LS.cart.total === "number") return window.LS.cart.total;
      if (window.LS.cart.subtotal_cents) return window.LS.cart.subtotal_cents / 100;
    }
    if (window.Cart && typeof window.Cart.subtotal === "number") return window.Cart.subtotal;

    var sel = [
      '[data-store="cart-subtotal"]',
      '[data-store="subtotal"]',
      '.js-cart-subtotal',
      '.cart-subtotal',
      '[data-cart-subtotal]',
    ];
    for (var i = 0; i < sel.length; i++) {
      var el = qs(sel[i]);
      if (el) {
        var txt = el.textContent || el.getAttribute("data-cart-subtotal") || "";
        var num = parseFloat(txt.replace(/[^\d,\.]/g, "").replace(/\./g, "").replace(",", "."));
        if (!isNaN(num) && num >= 0) return num;
      }
    }
    return 0;
  }

  function fetchCartSubtotal(callback) {
    try {
      fetch("/carrito.json", { credentials: "same-origin" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (data) {
          if (data) {
            var sub = data.subtotal || data.total || 0;
            if (typeof sub === "number") { callback(sub); return; }
          }
          callback(detectCartSubtotal());
        })
        .catch(function () { callback(detectCartSubtotal()); });
    } catch (e) {
      callback(detectCartSubtotal());
    }
  }

  /* ═══════════════════════════════════════════
     ESTILOS GLOBALES + KEYFRAMES
  ═══════════════════════════════════════════ */
  function injectGlobalStyles() {
    if (qs("#" + NS + "-styles")) return;
    const style = document.createElement("style");
    style.id = NS + "-styles";
    style.textContent = `
      .${NS}-root, .${NS}-root * {
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .${NS}-root { margin: 12px 0; line-height: 1.3; }
      .${NS}-topbar {
        position: fixed !important;
        top: 0; left: 0; right: 0;
        z-index: 999999;
        margin: 0 !important;
        border-radius: 0 !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .${NS}-widget-host { position: relative; overflow: hidden; }
      .${NS}-bar {
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        gap: 6px; padding: 10px 16px; overflow: hidden; width: 100%;
      }
      .${NS}-bar-row {
        display: flex; align-items: center; justify-content: center;
        gap: 10px; max-width: 100%;
      }
      .${NS}-bar-title {
        font-size: 13px; font-weight: 700;
        text-align: center; line-height: 1.3;
        max-width: 100%; padding: 0 4px;
      }
      .${NS}-bar-emoji {
        display: inline-block;
        animation: ${NS}-heartbeat 1.6s ease infinite;
        margin-right: 6px;
      }
      .${NS}-bar-clock {
        display: inline-flex; align-items: center;
        gap: 4px; flex-shrink: 0;
      }
      .${NS}-bar-digit {
        display: inline-flex; align-items: center; justify-content: center;
        min-width: 34px; height: 32px;
        background: #ffffff; color: #0f172a;
        border-radius: 6px; padding: 2px 6px;
        font-size: 14px; font-weight: 800;
        font-variant-numeric: tabular-nums;
        box-shadow: 0 2px 4px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.08);
        position: relative; overflow: hidden;
      }
      .${NS}-bar-digit::before {
        content: "";
        position: absolute; top: 0; left: 0; right: 0;
        height: 50%;
        background: linear-gradient(180deg, rgba(255,255,255,0.5), transparent);
        border-radius: 6px 6px 0 0;
        pointer-events: none;
      }
      .${NS}-bar-sep { font-size: 15px; font-weight: 900; opacity: 0.85; }
      .${NS}-bar-btn {
        padding: 7px 16px; background: #ffffff;
        border: none; border-radius: 7px;
        font-size: 11px; font-weight: 800;
        letter-spacing: 0.06em; cursor: pointer;
        white-space: nowrap; flex-shrink: 0;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      }
      .${NS}-digit {
        display: inline-flex; align-items: center; justify-content: center;
        font-weight: 800; font-variant-numeric: tabular-nums;
        letter-spacing: 0.02em;
        position: relative; overflow: hidden;
      }
      .${NS}-digit.bounce {
        animation: ${NS}-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .${NS}-label {
        font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.08em; opacity: 0.75;
      }
      .${NS}-unit {
        display: inline-flex; flex-direction: column;
        align-items: center; gap: 3px;
      }
      .${NS}-sep {
        display: inline-flex; flex-direction: column;
        gap: 4px; padding-bottom: 14px;
      }
      .${NS}-sep span {
        width: 4px; height: 4px; border-radius: 50%;
        opacity: 0.85;
        animation: ${NS}-blink 1s ease infinite;
      }
      .${NS}-retro-digit { display: inline-flex; gap: 2px; }
      .${NS}-retro-cell {
        width: 26px; height: 38px;
        background: linear-gradient(180deg, #2a2a3e 0%, #1a1a2e 50%, #2a2a3e 100%);
        border-radius: 5px;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Courier New', monospace; font-weight: 900;
        position: relative; overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
      }
      .${NS}-retro-cell::after {
        content: ''; position: absolute; top: 50%; left: 0; right: 0;
        height: 1px; background: rgba(0,0,0,0.5);
      }
      .${NS}-retro-cell.flip { animation: ${NS}-retroflip 0.3s ease; }
      .${NS}-banner-wrap {
        width: 100%; overflow: hidden; position: relative;
        -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 4%, #000 96%, transparent 100%);
        mask-image: linear-gradient(90deg, transparent 0, #000 4%, #000 96%, transparent 100%);
      }
      .${NS}-banner-track { display: inline-flex; white-space: nowrap; will-change: transform; }
      .${NS}-banner-item { display: inline-block; }
      .${NS}-progress-wrap { position: relative; width: 100%; padding-right: 24px; }
      .${NS}-progress-track { position: relative; width: 100%; height: 8px; border-radius: 999px; overflow: visible; }
      .${NS}-progress-fill { height: 100%; border-radius: 999px; transition: width 0.4s ease; }
      .${NS}-progress-hit {
        position: absolute; top: 50%; transform: translate(-50%, -50%);
        width: 22px; height: 22px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        transition: background 0.3s ease;
      }
      .${NS}-progress-floating {
        position: fixed !important; bottom: 20px; right: 20px;
        z-index: 999998; max-width: 340px; width: calc(100% - 40px);
        margin: 0 !important; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        border-radius: 12px;
      }

      /* ═══ BUNDLE PROMOCIONES ═══ */
      .${NS}-bundle {
        display: flex; flex-direction: column; gap: 10px;
        width: 100%;
      }
      .${NS}-bundle-title {
        font-weight: 700;
        margin-bottom: 4px;
      }
      .${NS}-bundle-card {
        display: flex; align-items: center;
        gap: 12px; padding: 14px 16px;
        border: 2px solid #e5e7eb; background: #ffffff;
        cursor: pointer; transition: all 0.15s ease;
        position: relative;
      }
      .${NS}-bundle-card:hover { border-color: #9ca3af; }
      .${NS}-bundle-card.selected { border-color: #000000; }
      .${NS}-bundle-radio {
        width: 20px; height: 20px; border-radius: 50%;
        border: 2px solid #9ca3af; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        background: #ffffff; transition: border-color 0.15s ease;
      }
      .${NS}-bundle-card.selected .${NS}-bundle-radio { border-color: #000000; }
      .${NS}-bundle-radio-dot {
        width: 10px; height: 10px; border-radius: 50%;
        background: #000000; opacity: 0;
        transition: opacity 0.15s ease;
      }
      .${NS}-bundle-card.selected .${NS}-bundle-radio-dot { opacity: 1; }
      .${NS}-bundle-info {
        flex: 1; display: flex; flex-direction: column;
        min-width: 0;
      }
      .${NS}-bundle-label { font-weight: 600; line-height: 1.2; }
      .${NS}-bundle-subtitle { font-weight: 500; line-height: 1.2; margin-top: 3px; }
      .${NS}-bundle-badges { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
      .${NS}-bundle-badge {
        display: inline-block; padding: 2px 8px;
        font-size: 10px; font-weight: 700;
        border-radius: 4px; color: #ffffff;
        letter-spacing: 0.04em; text-transform: uppercase;
      }
      .${NS}-bundle-prices {
        display: flex; flex-direction: column; align-items: flex-end;
        gap: 2px; flex-shrink: 0;
      }
      .${NS}-bundle-price-old {
        text-decoration: line-through; opacity: 0.55;
        font-size: 12px; font-weight: 500;
      }
      .${NS}-bundle-price-new { font-weight: 700; line-height: 1.1; }
      .${NS}-bundle-comps {
        display: flex; flex-direction: column; gap: 6px;
        margin-top: 8px; padding-top: 8px;
        border-top: 1px solid #e5e7eb;
      }
      .${NS}-bundle-comp {
        display: flex; align-items: center; gap: 8px;
        font-size: 12px; cursor: pointer;
      }
      .${NS}-bundle-comp input { cursor: pointer; margin: 0; }
      .${NS}-bundle-gift {
        display: flex; align-items: center; justify-content: space-between;
        margin-top: 8px; padding: 8px 10px;
      }
      .${NS}-bundle-gift-label {
        font-weight: 600; font-size: 12px;
      }
      .${NS}-bundle-btn {
        width: 100%; padding: 16px;
        border: none; cursor: pointer;
        font-weight: 700; text-align: center;
        transition: transform 0.15s ease;
        margin-top: 4px;
      }
      .${NS}-bundle-btn:hover { opacity: 0.94; }
      .${NS}-bundle-btn.zoom:hover { transform: scale(1.02); }
      .${NS}-bundle-btn.pulse { animation: ${NS}-bundle-pulse 1.6s ease infinite; }
      .${NS}-bundle-info-note {
        display: flex; align-items: flex-start; gap: 6px;
        font-size: 12px; color: #6b7280;
        padding: 8px 0; margin-top: 4px;
        border-top: 1px solid #e5e7eb;
      }

      /* ═══ CAJA DE OPINIONES (v2 - horizontal tipo testimonio) ═══ */
      .${NS}-opiniones-list {
        display: flex; flex-direction: column;
        gap: 10px; width: 100%;
      }
      .${NS}-opiniones-card {
        width: 100%; box-sizing: border-box;
      }
      .${NS}-opiniones-top {
        display: flex; align-items: center;
        gap: 12px;
      }
      .${NS}-opiniones-avatar {
        border-radius: 50%; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        font-weight: 700; user-select: none;
        overflow: hidden;
      }
      .${NS}-opiniones-avatar img {
        width: 100%; height: 100%; object-fit: cover; display: block;
      }
      .${NS}-opiniones-name-stars {
        display: flex; align-items: center;
        gap: 8px; flex-wrap: wrap; flex: 1; min-width: 0;
      }
      .${NS}-opiniones-name {
        font-weight: 700; line-height: 1.2;
      }
      .${NS}-opiniones-stars {
        display: inline-flex; gap: 1px; align-items: center;
      }
      .${NS}-opiniones-star {
        line-height: 1;
      }
      .${NS}-opiniones-text {
        line-height: 1.5; white-space: pre-wrap; word-break: break-word;
        margin-top: 10px;
      }

      /* ═══ INFORMACIÓN DE DESPACHO ═══ */
      .${NS}-despacho-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
        box-sizing: border-box;
      }
      .${NS}-despacho-left {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
        min-width: 0;
      }
      .${NS}-despacho-icon {
        display: inline-flex;
        align-items: center;
        flex-shrink: 0;
      }
      .${NS}-despacho-text-wrap {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
        flex: 1;
      }
      .${NS}-despacho-text {
        line-height: 1.25;
      }
      .${NS}-despacho-day-badge {
        display: inline-block;
        align-self: flex-start;
        padding: 3px 10px;
        border-radius: 6px;
        font-weight: 800;
        letter-spacing: 0.04em;
      }
      .${NS}-despacho-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        border-radius: 8px;
        flex-shrink: 0;
        min-width: 78px;
        line-height: 1.15;
      }
      .${NS}-despacho-right-label {
        opacity: 0.9;
        font-weight: 500;
      }
      .${NS}-despacho-right-value {
        font-weight: 800;
      }

      /* ═══ INFORMACIÓN DE ENVÍO ═══ */
      .${NS}-envio-wrap {
        width: 100%;
        box-sizing: border-box;
      }
      .${NS}-envio-box {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 6px;
        width: 100%;
        box-sizing: border-box;
      }
      .${NS}-envio-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 6px;
        flex: 1;
        min-width: 0;
        text-align: center;
      }
      .${NS}-envio-col-icon {
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .${NS}-envio-col-label {
        font-weight: 700;
        line-height: 1.2;
      }
      .${NS}-envio-col-value {
        opacity: 0.85;
        line-height: 1.2;
      }
      .${NS}-envio-badge-antes {
        display: inline-block;
        margin-top: 4px;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 700;
        letter-spacing: 0.03em;
        line-height: 1.2;
        white-space: nowrap;
      }
      .${NS}-envio-sep {
        width: 22px;
        height: 2px;
        opacity: 0.6;
        border-radius: 2px;
        flex-shrink: 0;
        align-self: center;
      }
      .${NS}-envio-nota {
        margin-top: 8px;
        font-size: 12px;
        color: #6b7280;
        text-align: center;
        font-style: italic;
      }

      /* ═══ MENSAJE DE ALERTA ═══ */
      .${NS}-alerta-box {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        box-sizing: border-box;
      }
      .${NS}-alerta-icono {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        line-height: 1;
      }
      .${NS}-alerta-icono img {
        width: 28px;
        height: 28px;
        object-fit: contain;
        display: block;
      }
      .${NS}-alerta-texto {
        flex: 1;
        min-width: 0;
        word-break: break-word;
        line-height: 1.4;
      }

      /* ═══ MENSAJE DE GARANTÍA ═══ */
      .${NS}-garantia-box {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        width: 100%;
        box-sizing: border-box;
      }
      .${NS}-garantia-img-wrap {
        flex-shrink: 0;
        width: 56px;
        height: 56px;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff;
      }
      .${NS}-garantia-img-wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .${NS}-garantia-content {
        flex: 1;
        min-width: 0;
      }
      .${NS}-garantia-titulo {
        font-weight: 700;
        line-height: 1.3;
        word-break: break-word;
      }
      .${NS}-garantia-texto {
        line-height: 1.5;
        word-break: break-word;
        margin-top: 6px;
      }
      .${NS}-garantia-texto ul {
        margin: 6px 0;
        padding-left: 20px;
      }
      .${NS}-garantia-texto li {
        margin: 2px 0;
      }

      /* ═══ RESEÑAS DE CLIENTES ═══ */
      .${NS}-resenas-wrap {
        width: 100%;
        box-sizing: border-box;
        padding: 20px 0;
      }
      .${NS}-resenas-titulo {
        font-weight: 700;
        line-height: 1.2;
        margin: 0 0 4px 0;
      }
      .${NS}-resenas-subtitulo {
        display: inline-block;
        line-height: 1.3;
        margin-bottom: 14px;
      }
      .${NS}-resenas-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 16px 0;
        border-bottom: 1px solid #f0f0f0;
        margin-bottom: 18px;
        flex-wrap: wrap;
      }
      .${NS}-resenas-header-left {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .${NS}-resenas-promedio {
        font-size: 34px;
        font-weight: 700;
        line-height: 1;
      }
      .${NS}-resenas-header-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .${NS}-resenas-header-stars {
        display: inline-flex;
        gap: 2px;
        line-height: 1;
      }
      .${NS}-resenas-total {
        font-size: 13px;
        color: #999;
      }
      .${NS}-resenas-btn {
        border: none;
        cursor: pointer;
        padding: 12px 22px;
        font-size: 14px;
        font-weight: 600;
        transition: opacity 0.15s ease;
        white-space: nowrap;
      }
      .${NS}-resenas-btn:hover {
        opacity: 0.88;
      }
      .${NS}-resenas-grid {
        display: grid;
        gap: 14px;
      }
      .${NS}-resenas-grid.cuadricula {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      }
      .${NS}-resenas-grid.lista {
        grid-template-columns: 1fr;
      }
      .${NS}-resenas-card {
        border-radius: 12px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .${NS}-resenas-card-foto {
        width: 100%;
        aspect-ratio: 4/3;
        border-radius: 8px;
        overflow: hidden;
        background: #eee;
      }
      .${NS}-resenas-card-foto img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .${NS}-resenas-card-header {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .${NS}-resenas-card-nombre {
        line-height: 1.2;
      }
      .${NS}-resenas-verified {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #1d9bf0;
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        flex-shrink: 0;
      }
      .${NS}-resenas-card-stars {
        display: inline-flex;
        gap: 1px;
        line-height: 1;
      }
      .${NS}-resenas-card-texto {
        margin: 0;
        line-height: 1.5;
        word-break: break-word;
      }
      .${NS}-resenas-card-fecha {
        margin-top: 4px;
        line-height: 1.2;
      }
      .${NS}-resenas-card-talle {
        display: inline-block;
        margin-top: 4px;
        padding: 2px 8px;
        border-radius: 4px;
        background: #f0f0f0;
        color: #555;
        font-size: 11px;
        font-weight: 600;
      }
      .${NS}-resenas-paginacion {
        display: flex;
        justify-content: center;
        gap: 6px;
        margin-top: 20px;
      }
      .${NS}-resenas-pag-btn {
        min-width: 34px;
        height: 34px;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        background: #fff;
        color: #374151;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .${NS}-resenas-pag-btn:hover {
        background: #f9fafb;
      }
      .${NS}-resenas-pag-btn.active {
        background: #1a1a1a;
        color: #fff;
        border-color: #1a1a1a;
      }
      .${NS}-resenas-empty {
        text-align: center;
        padding: 40px 20px;
        color: #6b7280;
        font-size: 14px;
      }
      .${NS}-resenas-titulo-mini {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 6px 0 10px 0;
        font-size: 14px;
      }
      .${NS}-resenas-titulo-mini-stars {
        display: inline-flex;
        gap: 1px;
      }
      .${NS}-resenas-titulo-mini-texto {
        color: #6b7280;
        font-weight: 500;
      }

      /* ═══ MODAL PÚBLICO DE RESEÑAS ═══ */
      .${NS}-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
      }
      .${NS}-modal-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }
      .${NS}-modal {
        background: #ffffff;
        border-radius: 16px;
        max-width: 480px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 24px;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
        transform: translateY(20px);
        transition: transform 0.2s ease;
      }
      .${NS}-modal-overlay.open .${NS}-modal {
        transform: translateY(0);
      }
      .${NS}-modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 18px;
      }
      .${NS}-modal-title {
        font-size: 20px;
        font-weight: 700;
        color: #111827;
        margin: 0;
      }
      .${NS}-modal-close {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 24px;
        color: #6b7280;
        line-height: 1;
        padding: 4px;
        margin: -4px;
      }
      .${NS}-modal-close:hover {
        color: #111827;
      }
      .${NS}-modal-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .${NS}-modal-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .${NS}-modal-label {
        font-size: 13px;
        font-weight: 600;
        color: #374151;
      }
      .${NS}-modal-input,
      .${NS}-modal-textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        color: #111827;
        background: #fff;
        outline: none;
        font-family: inherit;
        box-sizing: border-box;
      }
      .${NS}-modal-input:focus,
      .${NS}-modal-textarea:focus {
        border-color: #2563eb;
      }
      .${NS}-modal-textarea {
        resize: vertical;
        min-height: 90px;
        line-height: 1.4;
      }
      .${NS}-modal-stars {
        display: inline-flex;
        gap: 4px;
      }
      .${NS}-modal-star {
        cursor: pointer;
        font-size: 30px;
        color: #e5e7eb;
        line-height: 1;
        transition: color 0.1s ease, transform 0.1s ease;
        user-select: none;
      }
      .${NS}-modal-star:hover {
        transform: scale(1.1);
      }
      .${NS}-modal-star.filled {
        color: #f5b300;
      }
      .${NS}-modal-radio-group {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .${NS}-modal-radio-option {
        padding: 8px 12px;
        border: 1px solid #e5e7eb;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        color: #374151;
        cursor: pointer;
        background: #fff;
        transition: all 0.15s ease;
        user-select: none;
      }
      .${NS}-modal-radio-option.selected {
        background: #2563eb;
        color: #fff;
        border-color: #2563eb;
      }
      .${NS}-modal-photo-upload {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .${NS}-modal-photo-preview {
        max-width: 100%;
        max-height: 180px;
        border-radius: 8px;
        display: block;
      }
      .${NS}-modal-photo-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        border: 1.5px dashed #d1d5db;
        border-radius: 8px;
        background: #f9fafb;
        color: #374151;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        align-self: flex-start;
      }
      .${NS}-modal-photo-remove {
        color: #dc2626;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        background: transparent;
        border: none;
        padding: 4px 0;
        text-align: left;
      }
      .${NS}-modal-submit {
        width: 100%;
        padding: 14px;
        background: #1a1a1a;
        color: #fff;
        border: none;
        border-radius: 999px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        margin-top: 4px;
        transition: opacity 0.15s ease;
      }
      .${NS}-modal-submit:hover {
        opacity: 0.9;
      }
      .${NS}-modal-submit:disabled {
        opacity: 0.6;
        cursor: wait;
      }
      .${NS}-modal-error {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #991b1b;
        padding: 10px 12px;
        border-radius: 8px;
        font-size: 13px;
      }
      .${NS}-modal-success {
        text-align: center;
        padding: 20px 10px;
      }
      .${NS}-modal-success-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #d1fae5;
        color: #059669;
        font-size: 32px;
        margin-bottom: 14px;
      }
      .${NS}-modal-success-title {
        font-size: 18px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 8px;
      }
      .${NS}-modal-success-text {
        font-size: 14px;
        color: #6b7280;
        line-height: 1.5;
        margin-bottom: 14px;
      }
      .${NS}-modal-cupon-box {
        background: #eff6ff;
        border: 1px dashed #93c5fd;
        border-radius: 10px;
        padding: 14px;
        margin-top: 12px;
      }
      .${NS}-modal-cupon-label {
        font-size: 12px;
        color: #1e40af;
        font-weight: 600;
        margin-bottom: 6px;
      }
      .${NS}-modal-cupon-code {
        display: inline-block;
        background: #1e40af;
        color: #fff;
        padding: 6px 14px;
        border-radius: 6px;
        font-family: monospace;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 0.08em;
      }

      /* ═══ SLIDER DE VIDEO (Widget 15) ═══ */
      .${NS}-sv-wrap {
        width: 100%;
        box-sizing: border-box;
        padding: 20px 0;
      }
      .${NS}-sv-titulo {
        font-weight: 700;
        line-height: 1.2;
        margin: 0 0 4px 0;
      }
      .${NS}-sv-subtitulo {
        line-height: 1.4;
        opacity: 0.85;
        margin-bottom: 14px;
      }
      .${NS}-sv-carousel {
        position: relative;
        width: 100%;
      }
      .${NS}-sv-track {
        display: flex;
        gap: 12px;
        overflow-x: auto;
        scroll-behavior: smooth;
        padding-bottom: 6px;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .${NS}-sv-track::-webkit-scrollbar {
        display: none;
      }
      .${NS}-sv-video-card {
        flex: 0 0 auto;
        width: 180px;
        display: flex;
        flex-direction: column;
      }
      .${NS}-sv-video-thumb {
        position: relative;
        width: 100%;
        aspect-ratio: 9 / 16;
        overflow: hidden;
        background: #111827;
        cursor: pointer;
      }
      .${NS}-sv-video-thumb video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .${NS}-sv-video-thumb.inline {
        cursor: default;
      }
      .${NS}-sv-play-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.18);
        pointer-events: none;
        transition: background 0.2s ease;
      }
      .${NS}-sv-video-thumb:hover .${NS}-sv-play-overlay {
        background: rgba(0, 0, 0, 0.32);
      }
      .${NS}-sv-play-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.94);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      }
      .${NS}-sv-arrow {
        position: absolute;
        top: 40%;
        transform: translateY(-50%);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #ffffff;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 2;
        transition: transform 0.15s ease, opacity 0.15s ease;
      }
      .${NS}-sv-arrow:hover {
        transform: translateY(-50%) scale(1.08);
      }
      .${NS}-sv-arrow.left {
        left: -8px;
      }
      .${NS}-sv-arrow.right {
        right: -8px;
      }
      .${NS}-sv-arrow:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }
      .${NS}-sv-circles-row {
        display: flex;
        gap: 14px;
        overflow-x: auto;
        padding: 8px 4px;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .${NS}-sv-circles-row::-webkit-scrollbar {
        display: none;
      }
      .${NS}-sv-circle {
        flex: 0 0 auto;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
      }
      .${NS}-sv-circle-ring {
        padding: 3px;
        border-radius: 50%;
      }
      .${NS}-sv-circle-inner {
        width: 74px;
        height: 74px;
        border-radius: 50%;
        overflow: hidden;
        background: #111827;
        border: 3px solid #ffffff;
        position: relative;
      }
      .${NS}-sv-circle-inner video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .${NS}-sv-circle-play {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.15);
      }
      .${NS}-sv-producto-card {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background: #ffffff;
        border: 1px solid #eeeeee;
        margin-top: 10px;
        border-radius: 10px;
      }
      .${NS}-sv-producto-img {
        width: 44px;
        height: 44px;
        border-radius: 8px;
        object-fit: cover;
        flex-shrink: 0;
        background: #f3f4f6;
      }
      .${NS}-sv-producto-info {
        flex: 1;
        min-width: 0;
      }
      .${NS}-sv-producto-nombre {
        font-size: 13px;
        font-weight: 600;
        color: #111827;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
      }
      .${NS}-sv-producto-precio {
        font-size: 13px;
        color: #6b7280;
        margin-top: 2px;
        line-height: 1.2;
      }
      .${NS}-sv-producto-btn {
        border: none;
        cursor: pointer;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
        flex-shrink: 0;
        transition: opacity 0.15s ease;
      }
      .${NS}-sv-producto-btn:hover {
        opacity: 0.88;
      }
      .${NS}-sv-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.92);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
      }
      .${NS}-sv-modal-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }
      .${NS}-sv-modal {
        position: relative;
        max-width: 420px;
        width: 100%;
        max-height: calc(100vh - 40px);
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .${NS}-sv-modal-video-wrap {
        position: relative;
        width: 100%;
        aspect-ratio: 9 / 16;
        max-height: calc(100vh - 140px);
        background: #000000;
        border-radius: 14px;
        overflow: hidden;
      }
      .${NS}-sv-modal-video {
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #000000;
      }
      .${NS}-sv-modal-close {
        position: absolute;
        top: -46px;
        right: 0;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.14);
        border: none;
        color: #ffffff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s ease;
      }
      .${NS}-sv-modal-close:hover {
        background: rgba(255, 255, 255, 0.25);
      }
      .${NS}-sv-modal-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.14);
        border: none;
        color: #ffffff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3;
        transition: background 0.15s ease;
      }
      .${NS}-sv-modal-nav:hover {
        background: rgba(255, 255, 255, 0.28);
      }
      .${NS}-sv-modal-nav:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      .${NS}-sv-modal-nav.prev {
        left: -54px;
      }
      .${NS}-sv-modal-nav.next {
        right: -54px;
      }
      .${NS}-sv-modal-cta {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px;
        background: #ffffff;
        border-radius: 12px;
        margin-top: 14px;
        width: 100%;
        box-sizing: border-box;
      }
      @media (max-width: 540px) {
        .${NS}-sv-modal-nav.prev {
          left: 6px;
        }
        .${NS}-sv-modal-nav.next {
          right: 6px;
        }
        .${NS}-sv-modal-close {
          top: 6px;
          right: 6px;
          background: rgba(0, 0, 0, 0.5);
        }
      }

      @keyframes ${NS}-bundle-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
      @keyframes ${NS}-banner-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @keyframes ${NS}-bounce {
        0%   { transform: scale(1) translateY(0); }
        40%  { transform: scale(1.15) translateY(-2px); }
        70%  { transform: scale(0.95) translateY(1px); }
        100% { transform: scale(1) translateY(0); }
      }
      @keyframes ${NS}-retroflip {
        0% { transform: scaleY(1); opacity: 1; }
        40%,60% { transform: scaleY(0); opacity: 0.5; }
        100% { transform: scaleY(1); opacity: 1; }
      }
      @keyframes ${NS}-blink {
        0%,100% { opacity: 0.85; }
        50%     { opacity: 0.15; }
      }
      @keyframes ${NS}-heartbeat {
        0%,100% { transform: scale(1); }
        25% { transform: scale(1.2); }
        50% { transform: scale(1); }
      }
      @keyframes ${NS}-bounceDigit {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); }
        100% { transform: scale(1); }
      }
      @keyframes ${NS}-aureolaPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
        50% { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
      }
      @keyframes ${NS}-zoomEffect {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.04); }
      }
      @keyframes ${NS}-bounceBadge {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.15); }
      }
      @media (min-width: 720px) {
        .${NS}-bar { flex-direction: row; gap: 20px; }
        .${NS}-bar-title { font-size: 14px; }
      }
    `;
    document.head.appendChild(style);
        }
  /* ═══════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════ */
  const storeId = detectStoreId();
  const productId = detectProductId();
  const pageType = detectPageType();

  console.log("[Nevux] storeId:", storeId, "productId:", productId, "pageType:", pageType);

  if (!storeId) {
    console.warn("[Nevux] No se pudo detectar store_id");
    return;
  }

  injectGlobalStyles();

  // Detectar idioma del comprador (desde la etiqueta <html lang="..."> o configuración del navegador)
  var clientLang = document.documentElement.lang || navigator.language || "es";
  const url = API_BASE + "/api/widget-render?store_id=" + storeId +
    (productId ? "&product_id=" + productId : "") +
    "&lang=" + encodeURIComponent(clientLang) +
    "&_t=" + Date.now();

        /* ═══════════════════════════════════════════
     HELPER: COINCIDENCIA DE CATEGORÍA ULTRA-ESTRICTA Y EXACTA (v197 - ES5 STRICT)
  ═══════════════════════════════════════════ */
  var checkCategoryMatch = function (targetCatId, targetHandle, targetName) {
    if (!targetCatId) return false;
    var targetIdStr = String(targetCatId).trim().toLowerCase();
    var handleStr = targetHandle ? String(targetHandle).trim().toLowerCase() : "";
    var nameStr = targetName ? String(targetName).trim().toLowerCase() : "";

    var isProdPage = typeof window !== "undefined" && window.LS && window.LS.product;

    // 1. SI ESTAMOS EN UN LISTADO DE CATEGORÍA (Fotos 3 y 4)
    if (!isProdPage) {
      // A. window.LS.category (Objeto oficial de Tiendanube)
      if (typeof window !== "undefined" && window.LS && window.LS.category) {
        var cat = window.LS.category;
        if (typeof cat === "number" || typeof cat === "string") {
          var catRaw = String(cat).trim().toLowerCase();
          if (catRaw === targetIdStr || (handleStr && catRaw === handleStr)) return true;
        }
        if (typeof cat === "object" && cat !== null) {
          if (cat.id != null && String(cat.id).trim().toLowerCase() === targetIdStr) return true;
          if (handleStr && cat.handle && String(cat.handle).trim().toLowerCase() === handleStr) return true;
          if (nameStr && cat.name && String(cat.name).trim().toLowerCase() === nameStr) return true;
        }
      }

      // B. Pathname exacta del navegador (ej: /electronica o /nevux-1-0)
      if (typeof window !== "undefined" && window.location && window.location.pathname) {
        var pathParts = window.location.pathname.toLowerCase().split("/").filter(Boolean);
        for (var p = 0; p < pathParts.length; p++) {
          var part = pathParts[p];
          if (part === targetIdStr) return true;
          if (handleStr && part === handleStr) return true;
        }
      }

      // C. Clases estipuladas del Body por palabra completa
      if (typeof document !== "undefined" && document.body && document.body.className) {
        var classes = String(document.body.className).toLowerCase().split(/\s+/);
        for (var c = 0; c < classes.length; c++) {
          var cls = classes[c];
          if (cls === "category-" + targetIdStr || cls === "cat-" + targetIdStr) return true;
          if (handleStr && (cls === "category-" + handleStr || cls === "cat-" + handleStr)) return true;
        }
      }

      return false;
    }

    // 2. SI ESTAMOS EN LA FICHA DE UN PRODUCTO (Foto 2)
    if (isProdPage) {
      var prod = window.LS.product;
      if (!prod) return false;

      // A. Categorías asociadas al producto
      if (prod.categories) {
        var catList = Array.isArray(prod.categories) ? prod.categories : Object.values(prod.categories);
        for (var i = 0; i < catList.length; i++) {
          var item = catList[i];
          if (!item) continue;
          if (typeof item === "object") {
            if (item.id != null && String(item.id).trim().toLowerCase() === targetIdStr) return true;
            if (handleStr && item.handle && String(item.handle).trim().toLowerCase() === handleStr) return true;
            if (nameStr && item.name && String(item.name).trim().toLowerCase() === nameStr) return true;
          } else {
            var strVal = String(item).trim().toLowerCase();
            if (strVal === targetIdStr || (handleStr && strVal === handleStr)) return true;
          }
        }
      }

      // B. IDs directos
      if (prod.category_id != null && String(prod.category_id).trim().toLowerCase() === targetIdStr) return true;
      if (prod.categories_ids && Array.isArray(prod.categories_ids)) {
        for (var j = 0; j < prod.categories_ids.length; j++) {
          if (String(prod.categories_ids[j]).trim().toLowerCase() === targetIdStr) return true;
        }
      }

      // C. Breadcrumbs estrictos
      try {
        var bcLinks = document.querySelectorAll(".breadcrumb a, .breadcrumbs a, [data-store='breadcrumb'] a");
        for (var b = 0; b < bcLinks.length; b++) {
          var bcHref = (bcLinks[b].getAttribute("href") || "").toLowerCase().split("/").filter(Boolean);
          var bcText = (bcLinks[b].textContent || bcLinks[b].innerText || "").trim().toLowerCase();
          for (var k = 0; k < bcHref.length; k++) {
            if (bcHref[k] === targetIdStr || (handleStr && bcHref[k] === handleStr)) return true;
          }
          if (nameStr && bcText === nameStr) return true;
        }
      } catch (eBC) {}

      return false;
    }

    return false;
  };

  /* ═══════════════════════════════════════════
     FETCH UNIFICADO: UN SOLO VIAJE AL SERVIDOR
  ═══════════════════════════════════════════ */
  fetch(url)
    .then(function (r) { 
      return r.json(); 
    })
    .then(function (data) {
      if (data.activeCampaign) {
        renderAtmosphericEffects(data.activeCampaign);
      }

      if (data.voiceSearch && data.voiceSearch.is_active) {
        if (document.body) {
          renderNevuxVoiceUI(data.voiceSearch);
        } else {
          document.addEventListener("DOMContentLoaded", function () {
            renderNevuxVoiceUI(data.voiceSearch);
          });
        }
      }

      if (data.virtualSalesman && data.virtualSalesman.is_active) {
        if (document.body) {
          renderNevuxSalesmanUI(data.virtualSalesman);
        } else {
          document.addEventListener("DOMContentLoaded", function () {
            renderNevuxSalesmanUI(data.virtualSalesman);
          });
        }
      }

      if (data.socialProof && data.socialProof.is_active !== false && !data.socialProof.user_disabled) {
        if (document.body) {
          renderSocialProof(data.socialProof);
        } else {
          document.addEventListener("DOMContentLoaded", function () {
            renderSocialProof(data.socialProof);
          });
        }
      }

      if (data.widgets && data.widgets.length > 0) {
        console.log("[Nevux] Widgets activos recibidos:", data.widgets.length);

        data.widgets.forEach(function (w) {
          try {
          // 📦 5.1 FILTRO POR PRODUCTO ESPECÍFICO (v204 ULTRA-INMUNE)
            if (w.target_type === "product") {
              var curProdId = null;
              if (typeof window !== "undefined" && window.LS) {
                if (window.LS.product && window.LS.product.id) {
                  curProdId = String(window.LS.product.id).trim();
                } else if (window.LS.product_id) {
                  curProdId = String(window.LS.product_id).trim();
                }
              }
              if (!curProdId) {
                var pInput = document.querySelector("input[name='add_to_cart'], [data-product-id], form[action*='/cart'] input[type='hidden']");
                if (pInput) {
                  curProdId = String(pInput.getAttribute("data-product-id") || pInput.value || "").trim();
                }
              }

              var targetProdId = w.target_product_id
                ? String(w.target_product_id).trim()
                : w.config && w.config.product_id
                ? String(w.config.product_id).trim()
                : null;

              if (curProdId && targetProdId && curProdId !== targetProdId) {
                return;
              }
  }
            // 🏷️ 5.2 FILTRO POR CATEGORÍA
            if (w.target_type === "category") {
              var catId = w.target_category_id || (w.config && (w.config.category_id || w.config.target_category_id));
              var catHandle = w.category_handle || "";
              var catName = w.category_name || "";
              if (!catId || !checkCategoryMatch(catId, catHandle, catName)) {
                return;
              }
            }

            // 5.3 EJECUCIÓN DE CADA RENDEREADOR EN COINCIDENCIA
            if (w.widget_slug === "marquee-novedades") renderMarqueeNovedades(w);
            if (w.widget_slug === "horario-atencion") renderHorarioAtencion(w);
            if (w.widget_slug === "calculadora-ahorro") renderCalculadoraAhorro(w);
            if (w.widget_slug === "edicion-limitada") renderEdicionLimitada(w);
            if (w.widget_slug === "contador-vendidos") renderContadorVendidos(w);
            if (w.widget_slug === "cuenta-regresiva") renderCuentaRegresiva(w);
            if (w.widget_slug === "info-despacho") renderInfoDespacho(w);
            if (w.widget_slug === "urgencia-stock") renderUrgenciaStock(w);
            if (w.widget_slug === "resenas-destacadas") renderResenasDestacadas(w);
            if (w.widget_slug === "bundle-promociones") renderBundlePromociones(w);
            if (w.widget_slug === "popup-conversion") renderPopupConversion(w);
            if (w.widget_slug === "barra-envio-gratis") renderBarraEnvioGratis(w);
            if (w.widget_slug === "barra-cuotas") renderBarraCuotas(w);
            if (w.widget_slug === "productos-complementarios") renderProductosComplementarios(w);
            if (w.widget_slug === "bundle-cantidad") renderBundleCantidad(w);
            if (w.widget_slug === "slider-videos") renderSliderVideos(w);
            if (w.widget_slug === "barra-accion") renderBarraAccion(w);
            if (w.widget_slug === "mensaje-garantia") renderMensajeGarantia(w);
            if (w.widget_slug === "badge-efectivo") renderBadgeEfectivo(w);
            if (w.widget_slug === "preguntas-frecuentes") renderPreguntasFrecuentes(w);
            if (w.widget_slug === "banner-superior") renderBannerSuperior(w);
            if (w.widget_slug === "pack-complementarios") renderPackComplementarios(w);
            if (w.widget_slug === "comparador-antes-despues") renderComparadorAntesDespues(w);
            if (w.widget_slug === "beneficios") renderBeneficios(w);
            if (w.widget_slug === "tabla-talles") renderTablaTalles(w);
            if (w.widget_slug === "probador-virtual") renderProbadorVirtual(w);
            if (w.widget_slug === "caja-opiniones") renderCajaOpiniones(w);
            if (w.widget_slug === "caja-contacto") renderCajaContacto(w);
            if (w.widget_slug === "slider-imagenes") renderSliderImagenes(w);
            if (w.widget_slug === "video-texto") renderVideoTexto(w);
            if (w.widget_slug === "texto-libre") renderTextoLibre(w);
            if (w.widget_slug === "pasos") renderPasos(w);
            if (w.widget_slug === "informacion-envio") renderInformacionEnvio(w);
            if (w.widget_slug === "pestanas-informacion") renderPestanasInformacion(w);
            if (w.widget_slug === "imagenes-textos") renderImagenesTextos(w);
            if (w.widget_slug === "columnas-imagenes-texto") renderColumnasImagenesTexto(w);
            if (w.widget_slug === "comparador-marca") renderComparadorMarca(w);
            if (w.widget_slug === "video-flotante") renderVideoFlotante(w);
            if (w.widget_slug === "boton-whatsapp") renderBotonWhatsapp(w);
            if (w.widget_slug === "raspa-gana") renderRaspaGana(w);
            if (w.widget_slug === "popup-promocional") renderPopupPromocional(w);
            if (w.widget_slug === "notificaciones-flotantes") renderNotificacionesFlotantes(w);
            if (w.widget_slug === "alerta-inventario") renderAlertaInventario(w);
            if (w.widget_slug === "conjunto-productos") renderConjuntoProductos(w);
            if (w.widget_slug === "carrusel-resenas") renderCarruselResenas(w);
            if (w.widget_slug === "caja-estadisticas") renderCajaEstadisticas(w);
            if (w.widget_slug === "barra-descuento") renderBarraDescuento(w);
            if (w.widget_slug === "medios-pago") renderMediosPago(w);
            if (w.widget_slug === "favoritos") renderFavoritos(w);
          } catch (err) {
            console.error("[Nevux] Error renderizando widget:", w.widget_slug, err);
          }
        });
      } else {
        console.log("[Nevux] No se hallaron widgets activos para esta página");
      }
    })
    .catch(function (err) {
      console.error("[Nevux] Error crítico en el despachador Nevux:", err);
    });
  
/* ═══════════════════════════════════════════
   DETECCIÓN SEGURA DE PÁGINA (ES5 Safe)
═══════════════════════════════════════════ */
function detectPageType() {
  try {
    if (window.LS && window.LS.template) return String(window.LS.template).toLowerCase();
    var path = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : "";
    if (path === "/" || path === "" || path === "/index.php") return "home";
    if (path.indexOf("/productos/") !== -1 || path.indexOf("/producto/") !== -1 || path.indexOf("/p/") !== -1) return "product";
    if (path.indexOf("/carrito") !== -1 || path.indexOf("/cart") !== -1) return "cart";
    return "home";
  } catch (e) {
    return "home";
  }
}
  
/* ═══════════════════════════════════════════
   WIDGET: MARQUEE DE NOVEDADES (v193 - COMPLETA Y SEGURA)
   ═══════════════════════════════════════════ */
function renderMarqueeNovedades(w) {
  if (document.getElementById('nvx-marquee-' + w.id)) return;

  var cfg = w.config || {};
  var messages = Array.isArray(cfg.messages) && cfg.messages.length > 0
    ? cfg.messages
    : ['✨ Nuevo ingreso', '🔥 Más vendido', '📦 Envío gratis hoy'];

  var speed = cfg.speed || 'normal';
  var direction = cfg.direction || 'left';
  var bgColor = cfg.bgColor || '#111827';
  var textColor = cfg.textColor || '#ffffff';
  var fontSize = (cfg.fontSize || '14') + 'px';
  var pos = cfg.position || 'above_form';

  var dur = speed === 'lento' ? '24s' : speed === 'rapido' ? '8s' : '14s';
  var animName = direction === 'right' ? 'nvxMqR' : 'nvxMqL';

  if (!document.getElementById('nvx-marquee-styles')) {
    var st = document.createElement('style');
    st.id = 'nvx-marquee-styles';
    st.textContent = '@keyframes nvxMqL{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}@keyframes nvxMqR{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}';
    document.head.appendChild(st);
  }

  var container = document.createElement('div');
  container.id = 'nvx-marquee-' + w.id;
  container.className = 'nvx-widget nvx-marquee-wrapper';
  container.style.cssText = 'display:block !important;width:100% !important;max-width:100% !important;clear:both !important;overflow:hidden !important;background:' + bgColor + ' !important;padding:10px 0 !important;box-sizing:border-box !important;margin:12px 0 !important;position:relative !important;z-index:99 !important;cursor:default !important;';

  var track = document.createElement('div');
  track.style.cssText = 'display:flex !important;white-space:nowrap !important;width:max-content !important;animation:' + animName + ' ' + dur + ' linear infinite !important;';
  track.onmouseenter = function () { track.style.animationPlayState = 'paused'; };
  track.onmouseleave = function () { track.style.animationPlayState = 'running'; };

  var repeated = messages.concat(messages).concat(messages).concat(messages);
  var html = '';
  for (var i = 0; i < repeated.length; i++) {
    var rawMsg = repeated[i];
    var safeMsg = String(rawMsg)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    html +=
      '<span style="color:' +
      textColor +
      ' !important;font-size:' +
      fontSize +
      ' !important;font-weight:700 !important;padding:0 24px !important;display:inline-flex !important;align-items:center !important;letter-spacing:0.02em !important;font-family:system-ui,-apple-system,sans-serif !important;">' +
      safeMsg +
      '</span>';
  }
  track.innerHTML = html;
  container.appendChild(track);

  var targetEl = null;
  var insertMethod = 'before';
  var isProductPage = typeof window !== "undefined" && window.LS && window.LS.product;

  if (isProductPage) {
    // 1. FICHA DE PRODUCTO (Se inyecta según la posición configurada)
    var priceEl = document.querySelector(
      '.js-price-display, .price-display, #price_display, .price-container, .product-price-container, .js-product-price-container, .product-price, .js-price-container'
    );

    var addToCartBtn = document.querySelector(
      '.js-add-to-cart-btn, .js-prod-submit-btn, .js-add-to-cart, ' +
        '[data-store="product-buy-button"], .btn-add-to-cart, ' +
        'form[action*="/cart/add"] button[type="submit"], ' +
        'form[action*="/cart/add"] input[type="submit"], ' +
        '#product-buy-button, .js-buy-button, .product-buy-button'
    );

    var imageContainer = document.querySelector(
      '[data-store="product-image-container"], .js-product-image-container, ' +
        '.product-image-container, .js-product-slide-container, .js-gallery-container, ' +
        '.gallery-container, .product-gallery, #product-gallery, .js-product-viewport, ' +
        '.product-slider, #product-slider, .js-product-img-holder, .product-images, ' +
        '.js-product-images-container, .product-gallery-container'
    );

    var buyBlock = null;
    if (addToCartBtn) {
      buyBlock =
        addToCartBtn.closest(
          'form[action*="/cart/add"], form.js-product-buyform, .js-product-form, ' +
            '.product-form, .js-product-buy-button-container, .product-buy-button-container, ' +
            '.js-product-variants-group, .product-quantity-container, .js-quantity-container'
        ) || addToCartBtn.parentElement;
    }

    if (pos === 'below_image') {
      targetEl = imageContainer;
      insertMethod = 'after';
    } else if (pos === 'above_price') {
      targetEl = priceEl;
      insertMethod = 'before';
    } else if (pos === 'below_price') {
      targetEl = priceEl;
      insertMethod = 'after';
    } else if (pos === 'above_buy') {
      targetEl = buyBlock || addToCartBtn;
      insertMethod = 'before';
    } else if (pos === 'below_buy') {
      targetEl = buyBlock || addToCartBtn;
      insertMethod = 'after';
    } else {
      targetEl = priceEl || buyBlock;
      insertMethod = 'before';
    }

    if (!targetEl && priceEl) {
      targetEl = priceEl;
      insertMethod = 'before';
    }

    if (!targetEl) {
      var headerEl = document.querySelector('header, .js-header-wrapper, #header, .header-wrapper, nav.js-navbar');
      if (headerEl && headerEl.parentNode) {
        targetEl = headerEl;
        insertMethod = 'after';
      } else {
        targetEl = document.querySelector('main, #content, .main-content, .js-main-content, body');
        insertMethod = 'before';
      }
    }
  } else if (w.target_type === 'category' || (window.LS && window.LS.category)) {
    // 2. LISTADO DE CATEGORÍA (Inyección inteligente arriba de la grilla de productos)
    targetEl = document.querySelector('.js-product-grid, #product-grid, .product-grid, .product-list, h1.category-title, h1.header-title, .category-header, #products');
    if (targetEl) {
      insertMethod = 'before';
    } else {
      var mainContainer = document.querySelector('main, #content, .main-content, .js-main-content');
      if (mainContainer) {
        targetEl = mainContainer;
        insertMethod = 'prepend';
      } else {
        targetEl = document.body;
        insertMethod = 'prepend';
      }
    }
  } else {
    // 3. HOME O PÁGINAS GENERALES
    var homeBanner = document.querySelector(
      '.js-home-slider, .home-slider, .js-home-main-slider, [data-store*="slider"], [data-store*="banner"], .section-slider, .section-main-slider, .home-banners, .js-home-banner, .home-slider-wrapper, section.slider'
    );
    if (homeBanner && homeBanner.parentNode) {
      targetEl = homeBanner;
      insertMethod = 'before';
    } else {
      var globalHeader = document.querySelector(
        'header, .js-header-wrapper, #header, .header-wrapper, nav.js-navbar'
      );
      if (globalHeader && globalHeader.parentNode) {
        targetEl = globalHeader;
        insertMethod = 'after';
      } else {
        targetEl = document.querySelector(
          'main, #content, .main-content, .js-main-content, body'
        );
        insertMethod = 'before';
      }
    }
  }

  // INSERCIÓN REAL EN EL DOM
  if (targetEl && targetEl.parentNode) {
    if (insertMethod === 'before') {
      targetEl.parentNode.insertBefore(container, targetEl);
    } else if (insertMethod === 'after') {
      if (targetEl.nextSibling) {
        targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
      } else {
        targetEl.parentNode.appendChild(container);
      }
    } else if (insertMethod === 'prepend') {
      targetEl.insertBefore(container, targetEl.firstChild);
    }
  }

  if (typeof nvxTrack === 'function') {
    nvxTrack(w.id, 'impression');
  }
        }
/* ═══════════════════════════════════════════
   WIDGET: MARQUEE DE NOVEDADES (v11 Layout-Safe Buy Button)
   ═══════════════════════════════════════════ */
function renderMarqueeNovedades(w) {
  if (document.getElementById('nvx-marquee-' + w.id)) return;

  var cfg = w.config || {};
  var messages = Array.isArray(cfg.messages) && cfg.messages.length > 0
    ? cfg.messages
    : ['✨ Nuevo ingreso', '🔥 Más vendido', '📦 Envío gratis hoy'];

  var speed = cfg.speed || 'normal';
  var direction = cfg.direction || 'left';
  var bgColor = cfg.bgColor || '#111827';
  var textColor = cfg.textColor || '#ffffff';
  var fontSize = (cfg.fontSize || '14') + 'px';
  var pos = cfg.position || 'above_form';

  var dur = speed === 'lento' ? '24s' : speed === 'rapido' ? '8s' : '14s';
  var animName = direction === 'right' ? 'nvxMqR' : 'nvxMqL';

  if (!document.getElementById('nvx-marquee-styles')) {
    var st = document.createElement('style');
    st.id = 'nvx-marquee-styles';
    st.textContent = '@keyframes nvxMqL{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}@keyframes nvxMqR{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}';
    document.head.appendChild(st);
  }

  var container = document.createElement('div');
  container.id = 'nvx-marquee-' + w.id;
  container.className = 'nvx-widget nvx-marquee-wrapper';
  container.style.cssText = 'display:block;width:100%;max-width:100%;clear:both;overflow:hidden;background:' + bgColor + ';padding:10px 0;box-sizing:border-box;margin:12px 0;position:relative;z-index:99;cursor:default;';

  var track = document.createElement('div');
  track.style.cssText = 'display:flex;white-space:nowrap;width:max-content;animation:' + animName + ' ' + dur + ' linear infinite;';
  track.onmouseenter = function () { track.style.animationPlayState = 'paused'; };
  track.onmouseleave = function () { track.style.animationPlayState = 'running'; };

  var repeated = messages.concat(messages).concat(messages).concat(messages);
  var html = '';
  for (var i = 0; i < repeated.length; i++) {
    var rawMsg = repeated[i];
    var safeMsg = String(rawMsg)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    html +=
      '<span style="color:' +
      textColor +
      ';font-size:' +
      fontSize +
      ';font-weight:700;padding:0 24px;display:inline-flex;align-items:center;letter-spacing:0.02em;font-family:system-ui,-apple-system,sans-serif;">' +
      safeMsg +
      '</span>';
  }
  track.innerHTML = html;
  container.appendChild(track);

  var targetEl = null;
  var insertMethod = 'before';

  if (w.target_type === 'product' && w.target_product_id) {
    var priceEl = document.querySelector(
      '.js-price-display, .price-display, #price_display, .price-container, .product-price-container, .js-product-price-container, .product-price, .js-price-container'
    );

    var addToCartBtn = document.querySelector(
      '.js-add-to-cart-btn, .js-prod-submit-btn, .js-add-to-cart, ' +
        '[data-store="product-buy-button"], .btn-add-to-cart, ' +
        'form[action*="/cart/add"] button[type="submit"], ' +
        'form[action*="/cart/add"] input[type="submit"], ' +
        '#product-buy-button, .js-buy-button, .product-buy-button'
    );

    var imageContainer = document.querySelector(
      '[data-store="product-image-container"], .js-product-image-container, ' +
        '.product-image-container, .js-product-slide-container, .js-gallery-container, ' +
        '.gallery-container, .product-gallery, #product-gallery, .js-product-viewport, ' +
        '.product-slider, #product-slider, .js-product-img-holder, .product-images, ' +
        '.js-product-images-container, .product-gallery-container'
    );

    var buyBlock = null;
    if (addToCartBtn) {
      buyBlock =
        addToCartBtn.closest(
          'form[action*="/cart/add"], form.js-product-buyform, .js-product-form, ' +
            '.product-form, .js-product-buy-button-container, .product-buy-button-container, ' +
            '.js-product-variants-group, .product-quantity-container, .js-quantity-container'
        ) || addToCartBtn.parentElement;
    }

    if (pos === 'below_image') {
      targetEl = imageContainer;
      insertMethod = 'after';
    } else if (pos === 'above_price') {
      targetEl = priceEl;
      insertMethod = 'before';
    } else if (pos === 'below_price') {
      targetEl = priceEl;
      insertMethod = 'after';
    } else if (pos === 'above_buy') {
      targetEl = buyBlock || addToCartBtn;
      insertMethod = 'before';
    } else if (pos === 'below_buy') {
      targetEl = buyBlock || addToCartBtn;
      insertMethod = 'after';
    } else {
      targetEl = priceEl || buyBlock;
      insertMethod = 'before';
    }

    if (!targetEl && priceEl) {
      targetEl = priceEl;
      insertMethod = 'before';
    }

    // FALLBACK HOME SI NO ENCUENTRA BOTÓN DE PRODUCTO
    if (!targetEl) {
      var headerEl = document.querySelector('header, .js-header-wrapper, #header, .header-wrapper, nav.js-navbar');
      if (headerEl && headerEl.parentNode) {
        targetEl = headerEl;
        insertMethod = 'after';
      } else {
        targetEl = document.querySelector('main, #content, .main-content, .js-main-content, body');
        insertMethod = 'before';
      }
    }
  } else {
    var globalHeader = document.querySelector(
      'header, .js-header-wrapper, #header, .header-wrapper, nav.js-navbar'
    );
    if (globalHeader && globalHeader.parentNode) {
      targetEl = globalHeader;
      insertMethod = 'after';
    } else {
      targetEl = document.querySelector(
        'main, #content, .main-content, .js-main-content, body'
      );
      insertMethod = 'before';
    }
  }

  // INSERCIÓN REAL EN EL DOM
  if (targetEl && targetEl.parentNode) {
    if (insertMethod === 'before') {
      targetEl.parentNode.insertBefore(container, targetEl);
    } else if (insertMethod === 'after') {
      if (targetEl.nextSibling) {
        targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
      } else {
        targetEl.parentNode.appendChild(container);
      }
    } else if (insertMethod === 'prepend') {
      targetEl.insertBefore(container, targetEl.firstChild);
    }
  }

  if (typeof nvxTrack === 'function') {
    nvxTrack(w.id, 'impression');
  }
 }

 /* ═══════════════════════════════════════════
     MOTOR DE TELEMETRÍA Y ANALYTICS EN VIVO (NEVUX TRACK)
  ═══════════════════════════════════════════ */
  var nvxSessionId = (function() {
    try {
      var sid = sessionStorage.getItem("nvx_sid");
      if (!sid) {
        sid = "nvx_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
        sessionStorage.setItem("nvx_sid", sid);
      }
      return sid;
    } catch(e) {
      return "nvx_anon_" + Date.now();
    }
  })();

  function nvxTrack(w, eventType, eventValue, metadata) {
    try {
      if (!w || !w.widget_slug) return;
      var sId = (typeof storeId !== "undefined" && storeId) ? storeId : (w.store_id || 0);
      if (!sId) return;

      var pId = (typeof productId !== "undefined" && productId) ? productId : (w.target_product_id || null);

      var payload = {
        store_id: Number(sId),
        widget_id: w.id || null,
        widget_slug: String(w.widget_slug),
        event_type: String(eventType),
        event_value: Number(eventValue) || 0,
        session_id: nvxSessionId,
        product_id: pId ? Number(pId) : null,
        metadata: metadata || {}
      };

      var trackUrl = "https://nexus2026-gx7e.vercel.app/api/analytics/track";
      var dataStr = JSON.stringify(payload);

      if (navigator.sendBeacon) {
        navigator.sendBeacon(trackUrl, new Blob([dataStr], { type: "application/json" }));
      } else {
        fetch(trackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: dataStr,
          keepalive: true
        }).catch(function(){});
      }
    } catch(err) {}
  }

   /* ═══════════════════════════════════════════
     MOTOR DE TELEMETRÍA Y ANALYTICS EN VIVO (NEVUX TRACK)
  ═══════════════════════════════════════════ */
  var nvxSessionId = (function() {
    try {
      var sid = sessionStorage.getItem("nvx_sid");
      if (!sid) {
        sid = "nvx_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
        sessionStorage.setItem("nvx_sid", sid);
      }
      return sid;
    } catch(e) {
      return "nvx_anon_" + Date.now();
    }
  })();

  function nvxTrack(w, eventType, eventValue, metadata) {
    try {
      if (!w || !w.widget_slug) return;
      var sId = (typeof storeId !== "undefined" && storeId) ? storeId : (w.store_id || 0);
      if (!sId) return;

      var pId = (typeof productId !== "undefined" && productId) ? productId : (w.target_product_id || null);

      var payload = {
        store_id: Number(sId),
        widget_id: w.id || null,
        widget_slug: String(w.widget_slug),
        event_type: String(eventType),
        event_value: Number(eventValue) || 0,
        session_id: nvxSessionId,
        product_id: pId ? Number(pId) : null,
        metadata: metadata || {}
      };

      var trackUrl = "https://nexus2026-gx7e.vercel.app/api/analytics/track";
      var dataStr = JSON.stringify(payload);

      if (navigator.sendBeacon) {
        navigator.sendBeacon(trackUrl, new Blob([dataStr], { type: "application/json" }));
      } else {
        fetch(trackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: dataStr,
          keepalive: true
        }).catch(function(){});
      }
    } catch(err) {}
  }
  /* ═══════════════════════════════════════════
     MOTOR DE TELEMETRÍA Y ANALYTICS EN VIVO (NEVUX TRACK)
  ═══════════════════════════════════════════ */
  var nvxSessionId = (function() {
    try {
      var sid = sessionStorage.getItem("nvx_sid");
      if (!sid) {
        sid = "nvx_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
        sessionStorage.setItem("nvx_sid", sid);
      }
      return sid;
    } catch(e) {
      return "nvx_anon_" + Date.now();
    }
  })();

  function nvxTrack(w, eventType, eventValue, metadata) {
    try {
      if (!w || !w.widget_slug) return;
      var sId = (typeof storeId !== "undefined" && storeId) ? storeId : (w.store_id || 0);
      if (!sId) return;

      var pId = (typeof productId !== "undefined" && productId) ? productId : (w.target_product_id || null);

      var payload = {
        store_id: Number(sId),
        widget_id: w.id || null,
        widget_slug: String(w.widget_slug),
        event_type: String(eventType),
        event_value: Number(eventValue) || 0,
        session_id: nvxSessionId,
        product_id: pId ? Number(pId) : null,
        metadata: metadata || {}
      };

      var trackUrl = "https://nexus2026-gx7e.vercel.app/api/analytics/track";
      var dataStr = JSON.stringify(payload);

      if (navigator.sendBeacon) {
        navigator.sendBeacon(trackUrl, new Blob([dataStr], { type: "application/json" }));
      } else {
        fetch(trackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: dataStr,
          keepalive: true
        }).catch(function(){});
      }
    } catch(err) {}
  }
  
  /* ═══════════════════════════════════════════
     MOTOR DE TELEMETRÍA Y ANALYTICS EN VIVO (NEVUX TRACK)
  ═══════════════════════════════════════════ */
  var nvxSessionId = (function() {
    try {
      var sid = sessionStorage.getItem("nvx_sid");
      if (!sid) {
        sid = "nvx_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
        sessionStorage.setItem("nvx_sid", sid);
      }
      return sid;
    } catch(e) {
      return "nvx_anon_" + Date.now();
    }
  })();

  function nvxTrack(w, eventType, eventValue, metadata) {
    try {
      if (!w || !w.widget_slug) return;
      var sId = (typeof storeId !== "undefined" && storeId) ? storeId : (w.store_id || 0);
      if (!sId) return;

      var pId = (typeof productId !== "undefined" && productId) ? productId : (w.target_product_id || null);

      var payload = {
        store_id: Number(sId),
        widget_id: w.id || null,
        widget_slug: String(w.widget_slug),
        event_type: String(eventType),
        event_value: Number(eventValue) || 0,
        session_id: nvxSessionId,
        product_id: pId ? Number(pId) : null,
        metadata: metadata || {}
      };

      var trackUrl = "https://nexus2026-gx7e.vercel.app/api/analytics/track";
      var dataStr = JSON.stringify(payload);

      if (navigator.sendBeacon) {
        navigator.sendBeacon(trackUrl, new Blob([dataStr], { type: "application/json" }));
      } else {
        fetch(trackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: dataStr,
          keepalive: true
        }).catch(function(){});
      }
    } catch(err) {}
  }

  /* ═══════════════════════════════════════════
     MOTOR DE BÚSQUEDA POR VOZ IA EN VIVO (?v=69)
  ═══════════════════════════════════════════ */
  function renderNevuxVoiceUI(st) {
    try {
      if (document.getElementById("nvx-voice-trigger-btn")) return;
      if (!document.body) return;

      var color = st.button_color || "#10B981";
      var pos = st.position || "bottom-left";
      var lang = st.language || "es-AR";
      var listeningText = st.listening_text || "Escuchando... Decí lo que buscás";

      // Ubicación optimizada en lado izquierdo
      var posStyle = "bottom: 24px; left: 24px;";
      if (pos === "bottom-right") {
        posStyle = "bottom: 96px; right: 24px;";
      } else if (pos === "floating-center") {
        posStyle = "bottom: 24px; left: 50%; transform: translateX(-50%);";
      }

      // Botón flotante de Micrófono
      var floatBtn = document.createElement("button");
      floatBtn.id = "nvx-voice-trigger-btn";
      floatBtn.setAttribute("type", "button");
      floatBtn.setAttribute("aria-label", "Búsqueda por Voz");
      floatBtn.style.cssText = "position:fixed;" + posStyle + "z-index:2147483640;width:52px;height:52px;border-radius:50%;background:" + color + ";border:none;box-shadow:0 8px 24px " + color + "66,0 2px 6px rgba(0,0,0,0.2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform 0.2s cubic-bezier(0.175,0.885,0.32,1.275),box-shadow 0.2s ease;outline:none;-webkit-tap-highlight-color:transparent;";

      floatBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line><line x1="8" y1="22" x2="16" y2="22"></line></svg>';

      floatBtn.onmouseenter = function() { floatBtn.style.transform = (pos === "floating-center" ? "translateX(-50%) scale(1.08)" : "scale(1.08)"); };
      floatBtn.onmouseleave = function() { floatBtn.style.transform = (pos === "floating-center" ? "translateX(-50%) scale(1)" : "scale(1)"); };

      // Modal Frosted Glass
      var modal = document.createElement("div");
      modal.id = "nvx-voice-modal";
      modal.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:2147483645;display:none;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";

      modal.innerHTML = '<div style="background:#ffffff;border-radius:24px;width:100%;max-width:380px;padding:30px 22px;box-shadow:0 20px 50px rgba(0,0,0,0.3);text-align:center;position:relative;box-sizing:border-box;">'
        + '<button id="nvx-voice-close" style="position:absolute;top:16px;right:16px;background:#f3f4f6;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6b7280;font-size:16px;font-weight:bold;transition:background 0.2s;">✕</button>'
        + '<div style="margin-bottom:18px;font-size:11px;font-weight:800;letter-spacing:0.04em;color:' + color + ';text-transform:uppercase;display:inline-flex;align-items:center;gap:5px;background:' + color + '18;padding:4px 12px;border-radius:999px;">'
        + '<span style="width:7px;height:7px;border-radius:50%;background:' + color + ';display:inline-block;animation:nvxPulse 1.2s infinite;"></span> Búsqueda por Voz Nevux'
        + '</div>'
        + '<div style="position:relative;width:104px;height:104px;margin:0 auto 18px;">'
        + '<div id="nvx-wave-1" style="position:absolute;top:0;left:0;right:0;bottom:0;border-radius:50%;background:' + color + ';opacity:0.3;transform:scale(1);"></div>'
        + '<div id="nvx-wave-2" style="position:absolute;top:0;left:0;right:0;bottom:0;border-radius:50%;background:' + color + ';opacity:0.15;transform:scale(1);"></div>'
        + '<button id="nvx-mic-circle" style="position:relative;z-index:2;width:100%;height:100%;border-radius:50%;background:' + color + ';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 25px ' + color + '50;outline:none;">'
        + '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line><line x1="8" y1="22" x2="16" y2="22"></line></svg>'
        + '</button>'
        + '</div>'
        + '<h3 id="nvx-voice-title" style="margin:0 0 6px 0;font-size:16px;font-weight:800;color:#111827;line-height:1.3;">' + listeningText + '</h3>'
        + '<p style="margin:0 0 14px 0;font-size:13px;color:#6b7280;">Decí el nombre del producto que estás buscando</p>'
        + '<div id="nvx-voice-result" style="background:#f9fafb;border:1.5px dashed #e5e7eb;border-radius:14px;padding:12px;min-height:50px;font-size:15px;font-weight:700;color:#9ca3af;display:flex;align-items:center;justify-content:center;word-break:break-word;">Esperando tu voz...</div>'
        + '<div id="nvx-voice-error" style="display:none;margin-top:12px;padding:8px 12px;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;font-size:12px;color:#991b1b;font-weight:600;"></div>'
        + '</div>';

      var styleEl = document.createElement("style");
      styleEl.innerHTML = "@keyframes nvxPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.85);}}"
        + "@keyframes nvxWaveExpand1{0%{transform:scale(1);opacity:0.5;}50%{transform:scale(1.35);opacity:0.2;}100%{transform:scale(1);opacity:0.5;}}"
        + "@keyframes nvxWaveExpand2{0%{transform:scale(1);opacity:0.3;}50%{transform:scale(1.6);opacity:0.05;}100%{transform:scale(1);opacity:0.3;}}";
      document.head.appendChild(styleEl);

      document.body.appendChild(floatBtn);
      document.body.appendChild(modal);

      var closeBtn = modal.querySelector("#nvx-voice-close");
      var wave1 = modal.querySelector("#nvx-wave-1");
      var wave2 = modal.querySelector("#nvx-wave-2");
      var titleEl = modal.querySelector("#nvx-voice-title");
      var resultEl = modal.querySelector("#nvx-voice-result");
      var errorEl = modal.querySelector("#nvx-voice-error");
      var micCircle = modal.querySelector("#nvx-mic-circle");

      var recognition = null;
      var isListening = false;
      var redirectTimer = null;

      function startSpeech() {
        errorEl.style.display = "none";
        resultEl.style.color = "#9ca3af";
        resultEl.innerText = "Escuchando...";
        titleEl.innerText = listeningText;
        wave1.style.animation = "nvxWaveExpand1 1.6s infinite ease-in-out";
        wave2.style.animation = "nvxWaveExpand2 1.6s infinite 0.3s ease-in-out";

        var SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRec) {
          errorEl.innerText = "Tu navegador no soporta búsqueda por voz nativa.";
          errorEl.style.display = "block";
          stopWaves();
          return;
        }

        try {
          if (recognition) {
            try { recognition.abort(); } catch(e) {}
          }
          recognition = new SpeechRec();
          recognition.lang = lang;
          recognition.continuous = false;
          recognition.interimResults = true;

          recognition.onresult = function(ev) {
            var text = "";
            for (var i = 0; i < ev.results.length; i++) {
              text += ev.results[i][0].transcript;
            }
            if (text) {
              resultEl.style.color = "#111827";
              resultEl.innerText = '"' + text + '"';
            }

            if (ev.results[0] && ev.results[0].isFinal) {
              titleEl.innerText = "¡Buscando en la tienda!";
              stopWaves();
              if (redirectTimer) clearTimeout(redirectTimer);
              redirectTimer = setTimeout(function() {
                window.location.href = "/search/?q=" + encodeURIComponent(text.trim());
              }, 650);
            }
          };

          recognition.onerror = function(ev) {
            stopWaves();
            isListening = false;
            if (ev.error === "not-allowed") {
              errorEl.innerText = "Permiso denegado. Habilitá el micrófono en tu navegador.";
            } else if (ev.error === "no-speech") {
              errorEl.innerText = "No se detectó audio. Tocá el micrófono e intentá de nuevo.";
            } else {
              errorEl.innerText = "Micrófono detenido o no disponible.";
            }
            errorEl.style.display = "block";
          };

          recognition.onend = function() {
            isListening = false;
            stopWaves();
          };

          recognition.start();
          isListening = true;
        } catch(err) {
          stopWaves();
          isListening = false;
          errorEl.innerText = "No se pudo acceder al micrófono.";
          errorEl.style.display = "block";
        }
      }

      function stopWaves() {
        if (wave1) wave1.style.animation = "none";
        if (wave2) wave2.style.animation = "none";
      }

      function openModal() {
        modal.style.display = "flex";
        startSpeech();
      }

      function closeModal() {
        if (redirectTimer) clearTimeout(redirectTimer);
        if (recognition) {
          try { recognition.abort(); } catch(e) {}
        }
        stopWaves();
        modal.style.display = "none";
      }

      floatBtn.onclick = function() { openModal(); };
      closeBtn.onclick = function() { closeModal(); };
      modal.onclick = function(e) {
        if (e.target === modal) closeModal();
      };
      micCircle.onclick = function() {
        if (isListening) {
          if (recognition) recognition.stop();
          stopWaves();
        } else {
          startSpeech();
        }
      };
    } catch(e) {}
  }

  /* ═══════════════════════════════════════════
     MOTOR DE VENDEDOR VIRTUAL IA EN VIVO (?v=69)
  ═══════════════════════════════════════════ */
  function renderNevuxSalesmanUI(st) {
    try {
      if (document.getElementById("nvx-salesman-trigger-btn")) return;
      if (!document.body) return;

      var color = st.theme_color || "#10B981";
      var agentName = st.agent_name || "Sofía (Asesora Virtual)";
      var avatar = st.agent_avatar || "👩‍💼";
      var welcomeMsg = st.welcome_message || "¡Hola! 👋 ¿Buscás algo en especial hoy? Contame y te ayudo.";
      var personality = st.personality || "friendly";
      var whatsapp = (st.whatsapp_number || "").replace(/[^0-9]/g, "");
      var enableWa = !!(st.enable_whatsapp_escalation && whatsapp);

      // Botón flotante del Asesor (Ubicado a la izquierda, arriba del micrófono)
      var triggerBtn = document.createElement("button");
      triggerBtn.id = "nvx-salesman-trigger-btn";
      triggerBtn.setAttribute("type", "button");
      triggerBtn.setAttribute("aria-label", "Abrir chat con asesor virtual");
      triggerBtn.style.cssText = "position:fixed;bottom:88px;left:24px;z-index:2147483638;width:54px;height:54px;border-radius:50%;background:" + color + ";border:none;box-shadow:0 8px 25px rgba(0,0,0,0.18),0 2px 8px " + color + "60;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:24px;transition:transform 0.25s cubic-bezier(0.175,0.885,0.32,1.275);outline:none;-webkit-tap-highlight-color:transparent;";
      triggerBtn.innerHTML = avatar + '<span style="position:absolute;bottom:2px;right:2px;width:12px;height:12px;border-radius:50%;background:#10B981;border:2px solid #ffffff;"></span>';

      // Globito emergente de saludo (aparece a la izquierda arriba del asesor)
      var tooltip = document.createElement("div");
      tooltip.id = "nvx-salesman-tooltip";
      tooltip.style.cssText = "position:fixed;bottom:152px;left:24px;z-index:2147483637;background:#ffffff;color:#111827;padding:9px 14px;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,0.12);font-size:12.5px;font-weight:700;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:210px;line-height:1.35;border:1px solid #f3f4f6;display:none;cursor:pointer;animation:nvxSlideUp 0.3s ease-out;";
      tooltip.innerHTML = '¡Hola! ¿Puedo ayudarte a elegir hoy? 👋';

      // Ventana de Chat Flotante (Anclada a la izquierda de la pantalla)
      var chatBox = document.createElement("div");
      chatBox.id = "nvx-salesman-chatbox";
      chatBox.style.cssText = "position:fixed;bottom:24px;left:24px;z-index:2147483642;width:360px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 48px);background:#ffffff;border-radius:20px;box-shadow:0 15px 45px rgba(0,0,0,0.22);display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;border:1px solid rgba(0,0,0,0.06);box-sizing:border-box;";

      chatBox.innerHTML = '<div style="background:' + color + ';color:#ffffff;padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;">'
        + '<div style="width:38px;height:38px;border-radius:50%;background:#ffffff;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">' + avatar + '</div>'
        + '<div style="flex:1;min-width:0;">'
        + '<div style="font-size:14px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + agentName + '</div>'
        + '<div style="font-size:11px;color:rgba(255,255,255,0.9);display:flex;align-items:center;gap:4px;"><span style="width:6px;height:6px;border-radius:50%;background:#4ade80;display:inline-block;"></span> En línea</div>'
        + '</div>'
        + '<button id="nvx-chat-close-btn" style="background:rgba(255,255,255,0.2);border:none;color:#ffffff;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;font-weight:bold;">✕</button>'
        + '</div>'
        + '<div id="nvx-chat-messages" style="flex:1;padding:14px;overflow-y:auto;background:#f9fafb;display:flex;flex-direction:column;gap:10px;box-sizing:border-box;"></div>'
        + '<div style="padding:6px 10px;background:#ffffff;border-top:1px solid #f3f4f6;display:flex;gap:6px;overflow-x:auto;white-space:nowrap;-webkit-overflow-scrolling:touch;" id="nvx-quick-chips">'
        + '<button class="nvx-chip" data-text="¿Tienen cuotas sin interés?" style="padding:5px 10px;border-radius:999px;border:1px solid #e5e7eb;background:#f9fafb;font-size:11px;font-weight:700;color:#374151;cursor:pointer;">¿Cuotas?</button>'
        + '<button class="nvx-chip" data-text="¿Cómo son los envíos?" style="padding:5px 10px;border-radius:999px;border:1px solid #e5e7eb;background:#f9fafb;font-size:11px;font-weight:700;color:#374151;cursor:pointer;">¿Envíos?</button>'
        + '<button class="nvx-chip" data-text="¿Cuáles son los más vendidos?" style="padding:5px 10px;border-radius:999px;border:1px solid #e5e7eb;background:#f9fafb;font-size:11px;font-weight:700;color:#374151;cursor:pointer;">Más vendidos</button>'
        + (enableWa ? '<button class="nvx-chip" data-text="Quiero hablar por WhatsApp" style="padding:5px 10px;border-radius:999px;border:1px solid #a7f3d0;background:#ecfdf5;font-size:11px;font-weight:800;color:#059669;cursor:pointer;">💬 WhatsApp</button>' : '')
        + '</div>'
        + '<form id="nvx-chat-form" style="padding:10px 12px;background:#ffffff;border-top:1px solid #e5e7eb;display:flex;align-items:center;gap:8px;box-sizing:border-box;">'
        + '<input id="nvx-chat-input" type="text" placeholder="Escribí tu consulta..." style="flex:1;padding:8px 12px;border-radius:10px;border:1.5px solid #e5e7eb;font-size:13px;outline:none;font-family:inherit;box-sizing:border-box;">'
        + '<button type="submit" style="background:' + color + ';color:#ffffff;border:none;border-radius:10px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">'
        + '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>'
        + '</button>'
        + '</form>';

      var styleEl = document.createElement("style");
      styleEl.innerHTML = "@keyframes nvxSlideUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}";
      document.head.appendChild(styleEl);

      document.body.appendChild(triggerBtn);
      document.body.appendChild(tooltip);
      document.body.appendChild(chatBox);

      var msgsContainer = chatBox.querySelector("#nvx-chat-messages");
      var chatForm = chatBox.querySelector("#nvx-chat-form");
      var chatInput = chatBox.querySelector("#nvx-chat-input");
      var closeBtn = chatBox.querySelector("#nvx-chat-close-btn");
      var chipBtns = chatBox.querySelectorAll(".nvx-chip");

      // Iniciar con mensaje de bienvenida
      addMessage("bot", welcomeMsg);

      setTimeout(function() {
        if (chatBox.style.display !== "flex") {
          tooltip.style.display = "block";
        }
      }, 3500);

      function openChat() {
        tooltip.style.display = "none";
        triggerBtn.style.display = "none";
        chatBox.style.display = "flex";
        chatInput.focus();
        scrollToBottom();
      }

      function closeChat() {
        chatBox.style.display = "none";
        triggerBtn.style.display = "flex";
      }

      function scrollToBottom() {
        msgsContainer.scrollTop = msgsContainer.scrollHeight;
      }

      function addMessage(sender, text, showWa) {
        var msgRow = document.createElement("div");
        msgRow.style.cssText = "display:flex;flex-direction:column;align-items:" + (sender === "user" ? "flex-end" : "flex-start") + ";";

        var bubble = document.createElement("div");
        bubble.style.cssText = "max-width:82%;padding:10px 14px;border-radius:" + (sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px") + ";background:" + (sender === "user" ? color : "#ffffff") + ";color:" + (sender === "user" ? "#ffffff" : "#111827") + ";font-size:13px;line-height:1.45;border:" + (sender === "user" ? "none" : "1px solid #e5e7eb") + ";box-shadow:0 1px 4px rgba(0,0,0,0.04);word-break:break-word;";
        bubble.innerText = text;

        msgRow.appendChild(bubble);

        if (showWa && enableWa) {
          var waBtn = document.createElement("a");
          waBtn.href = "https://wa.me/" + whatsapp + "?text=" + encodeURIComponent("¡Hola! Estaba viendo la tienda y quería consultar sobre un producto.");
          waBtn.target = "_blank";
          waBtn.rel = "noreferrer";
          waBtn.style.cssText = "margin-top:6px;display:inline-flex;align-items:center;gap:6px;background:#25D366;color:#ffffff;text-decoration:none;padding:6px 12px;border-radius:999px;font-size:11.5px;font-weight:800;box-shadow:0 2px 8px rgba(37,211,102,0.3);";
          waBtn.innerHTML = '💬 Continuar por WhatsApp';
          msgRow.appendChild(waBtn);
        }

        msgsContainer.appendChild(msgRow);
        scrollToBottom();
      }

      function showTypingIndicator() {
        var typing = document.createElement("div");
        typing.id = "nvx-typing";
        typing.style.cssText = "font-size:11.5px;color:#6b7280;font-style:italic;padding:4px 8px;";
        typing.innerText = agentName + " está respondiendo...";
        msgsContainer.appendChild(typing);
        scrollToBottom();
      }

      function hideTypingIndicator() {
        var typing = document.getElementById("nvx-typing");
        if (typing) typing.remove();
      }

      function generateBotReply(userText) {
        var lower = userText.toLowerCase();
        var reply = "¡Excelente consulta! Tenemos opciones destacadas en stock con despacho inmediato. ¿Te gustaría que te recomiende los modelos más elegidos?";
        var offerWa = false;

        if (lower.includes("precio") || lower.includes("cuanto") || lower.includes("cuánto") || lower.includes("valor")) {
          reply = personality === "dynamic" 
            ? "¡Hoy tenés promociones especiales y cuotas sin interés activas en toda la tienda! 🎁 ¿Querés que te pase el link con los descuentos?"
            : "Los precios están actualizados con opciones de financiación y descuentos por transferencia bancaria.";
        } else if (lower.includes("cuota") || lower.includes("tarjeta") || lower.includes("pago") || lower.includes("interes") || lower.includes("interés")) {
          reply = "¡Sí! Aceptamos todas las tarjetas con cuotas sin interés y promociones bancarias disponibles en el checkout 💳.";
        } else if (lower.includes("envio") || lower.includes("envío") || lower.includes("demora") || lower.includes("llega")) {
          reply = "Hacemos envíos seguros y rápidos a todo el país 🚚. Superando el monto mínimo de compra tenés envío gratis hasta tu domicilio.";
        } else if (lower.includes("talle") || lower.includes("medida") || lower.includes("tamaño")) {
          reply = "Contamos con guía interactiva de talles en cada producto para que elijas la medida exacta y compres con total seguridad 📏.";
        } else if (lower.includes("whatsapp") || lower.includes("humano") || lower.includes("asesor") || lower.includes("persona")) {
          reply = "¡Por supuesto! Podés hablar directamente con nuestro equipo humano por WhatsApp para una atención 1 a 1.";
          offerWa = true;
        } else if (lower.includes("vendido") || lower.includes("recomenda") || lower.includes("destacado")) {
          reply = "¡Los más vendidos de esta semana están volando! Te invito a ver la sección principal de la tienda para no perderte las últimas unidades disponibles.";
        }

        setTimeout(function() {
          hideTypingIndicator();
          addMessage("bot", reply, offerWa || (enableWa && Math.random() > 0.6));
        }, 900);
      }

      function handleUserSend(text) {
        if (!text || !text.trim()) return;
        addMessage("user", text.trim());
        chatInput.value = "";
        showTypingIndicator();
        generateBotReply(text.trim());
      }

      triggerBtn.onclick = openChat;
      tooltip.onclick = openChat;
      closeBtn.onclick = closeChat;

      chatForm.onsubmit = function(e) {
        e.preventDefault();
        handleUserSend(chatInput.value);
      };

      for (var i = 0; i < chipBtns.length; i++) {
        chipBtns[i].onclick = function() {
          var t = this.getAttribute("data-text");
          handleUserSend(t);
        };
      }
    } catch(e) {}
 }
  /* ═══════════════════════════════════════════
   WIDGET: MARQUEE DE NOVEDADES (v11 Layout-Safe Buy Button)
   ═══════════════════════════════════════════ */
function renderMarqueeNovedades(w) {
  if (document.getElementById('nvx-marquee-' + w.id)) return;

  var cfg = w.config || {};
  var messages = Array.isArray(cfg.messages) && cfg.messages.length > 0
    ? cfg.messages
    : ['✨ Nuevo ingreso', '🔥 Más vendido', '📦 Envío gratis hoy'];

  var speed = cfg.speed || 'normal';
  var direction = cfg.direction || 'left';
  var bgColor = cfg.bgColor || '#111827';
  var textColor = cfg.textColor || '#ffffff';
  var fontSize = (cfg.fontSize || '14') + 'px';
  var pos = cfg.position || 'above_form';

  var dur = speed === 'lento' ? '24s' : speed === 'rapido' ? '8s' : '14s';
  var animName = direction === 'right' ? 'nvxMqR' : 'nvxMqL';

  if (!document.getElementById('nvx-marquee-styles')) {
    var st = document.createElement('style');
    st.id = 'nvx-marquee-styles';
    st.textContent = '@keyframes nvxMqL{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}@keyframes nvxMqR{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}';
    document.head.appendChild(st);
  }

  var container = document.createElement('div');
  container.id = 'nvx-marquee-' + w.id;
  container.className = 'nvx-widget nvx-marquee-wrapper';
  // Forzamos ancho completo y bloque para que NUNCA se meta en un flex row
  container.style.cssText = 'display:block;width:100%;max-width:100%;clear:both;overflow:hidden;background:' + bgColor + ';padding:10px 0;box-sizing:border-box;margin:12px 0;position:relative;z-index:99;cursor:default;';

  var track = document.createElement('div');
  track.style.cssText = 'display:flex;white-space:nowrap;width:max-content;animation:' + animName + ' ' + dur + ' linear infinite;';
  track.onmouseenter = function () { track.style.animationPlayState = 'paused'; };
  track.onmouseleave = function () { track.style.animationPlayState = 'running'; };

  var repeated = messages.concat(messages).concat(messages).concat(messages);
  var html = '';
  for (var i = 0; i < repeated.length; i++) {
    var rawMsg = repeated[i];
    var safeMsg = String(rawMsg)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    html +=
      '<span style="color:' +
      textColor +
      ';font-size:' +
      fontSize +
      ';font-weight:700;padding:0 24px;display:inline-flex;align-items:center;letter-spacing:0.02em;font-family:system-ui,-apple-system,sans-serif;">' +
      safeMsg +
      '</span>';
  }
  track.innerHTML = html;
  container.appendChild(track);

  var targetEl = null;
  var insertMethod = 'before';

  if (w.target_type === 'product' && w.target_product_id) {
    // 💵 PRECIO
    var priceEl = document.querySelector(
      '.js-price-display, .price-display, #price_display, .price-container, .product-price-container, .js-product-price-container, .product-price, .js-price-container'
    );

    // 🛒 BOTÓN AGREGAR AL CARRITO
    var addToCartBtn = document.querySelector(
      '.js-add-to-cart-btn, .js-prod-submit-btn, .js-add-to-cart, ' +
        '[data-store="product-buy-button"], .btn-add-to-cart, ' +
        'form[action*="/cart/add"] button[type="submit"], ' +
        'form[action*="/cart/add"] input[type="submit"], ' +
        '#product-buy-button, .js-buy-button, .product-buy-button'
    );

    // 🖼️ GALERÍA / FOTO
    var imageContainer = document.querySelector(
      '[data-store="product-image-container"], .js-product-image-container, ' +
        '.product-image-container, .js-product-slide-container, .js-gallery-container, ' +
        '.gallery-container, .product-gallery, #product-gallery, .js-product-viewport, ' +
        '.product-slider, #product-slider, .js-product-img-holder, .product-images, ' +
        '.js-product-images-container, .product-gallery-container'
    );
    if (!imageContainer) {
      var mainImg = document.querySelector(
        'img[itemprop="image"], img.product-image, img.js-product-slide-image, .js-product-slide img, .product-gallery img'
      );
      if (mainImg) {
        imageContainer = mainImg.closest(
          '.js-product-image-container, .product-image-container, .product-gallery, div'
        );
      }
    }

    // 📦 CONTENEDOR COMPLETO DE COMPRA (cantidad + botón)
    // Evita insertar DENTRO del flex row del botón
    var buyBlock = null;
    if (addToCartBtn) {
      buyBlock =
        addToCartBtn.closest(
          'form[action*="/cart/add"], form.js-product-buyform, .js-product-form, ' +
            '.product-form, .js-product-buy-button-container, .product-buy-button-container, ' +
            '.js-product-variants-group, .product-quantity-container, .js-quantity-container'
        ) || addToCartBtn.parentElement;
    }

    // ── APLICAR UBICACIÓN ──
    if (pos === 'below_image') {
      targetEl = imageContainer;
      insertMethod = 'after';
    } else if (pos === 'above_price') {
      targetEl = priceEl;
      insertMethod = 'before';
    } else if (pos === 'below_price') {
      targetEl = priceEl;
      insertMethod = 'after';
    } else if (pos === 'above_buy') {
      // Insertar ANTES del bloque completo (no del botón suelto)
      targetEl = buyBlock || addToCartBtn;
      insertMethod = 'before';
    } else if (pos === 'below_buy') {
      // Insertar DESPUÉS del bloque completo (no del botón suelto)
      targetEl = buyBlock || addToCartBtn;
      insertMethod = 'after';
    } else {
      // above_form (default)
      targetEl = priceEl || buyBlock;
      insertMethod = 'before';
    }

    // Fallbacks seguros
    if (!targetEl && priceEl) {
      targetEl = priceEl;
      insertMethod = 'before';
    }
    if (!targetEl) {
      targetEl = document.querySelector(
        'form[action*="/cart/add"], form.js-product-buyform, .js-product-form, input[type="submit"], button[type="submit"]'
      );
      insertMethod = 'before';
    }

    // Inserción real
    if (targetEl && targetEl.parentNode) {
      if (insertMethod === 'before') {
        targetEl.parentNode.insertBefore(container, targetEl);
      } else {
        if (targetEl.nextSibling) {
          targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
        } else {
          targetEl.parentNode.appendChild(container);
        }
      }
    }
  } else {
    // Global (home / todas las páginas)
    var header = document.querySelector(
      'header, .js-header-wrapper, #header, .header-wrapper, nav.js-navbar'
    );
    if (header && header.parentNode) {
      header.parentNode.insertBefore(container, header.nextSibling);
    } else {
      var main = document.querySelector(
        'main, #content, .main-content, .js-main-content, body'
      );
      if (main) {
        main.insertBefore(container, main.firstChild);
      }
    }
  }

  if (typeof nvxTrack === 'function') {
    nvxTrack(w.id, 'impression');
  }
}
 /* ═══════════════════════════════════════════
   WIDGET: HORARIO DE ATENCIÓN (v190 - ES5 STRICT)
   ═══════════════════════════════════════════ */
function renderHorarioAtencion(w) {
  if (document.getElementById('nvx-horario-' + w.id)) return;

  var cfg = w.config || {};
  var openTime = cfg.openTime || "09:00";
  var closeTime = cfg.closeTime || "18:00";
  var workDays = Array.isArray(cfg.workDays) ? cfg.workDays : [1, 2, 3, 4, 5];
  var openText = cfg.openText || "🟢 ¡Abierto! Estamos online para ayudarte en tus compras.";
  var closedText = cfg.closedText || "🔴 Cerrado ahora. Pero podés comprar y procesamos tu pedido mañana.";
  var bgColor = cfg.bgColor || "#ffffff";
  var textColor = cfg.textColor || "#111827";
  var borderColor = cfg.borderColor || "#e5e7eb";
  var showIcon = typeof cfg.showIcon === "boolean" ? cfg.showIcon : true;

  // Formateador dinámico ES5 (Regla #19 y #39)
  var formatWorkDaysLocal = function(days) {
    if (!days || days.length === 0) return "Ningún día";
    if (days.length === 7) return "Todos los días";

    var sortedDays = days.slice().sort(function(a, b) {
      var valA = a === 0 ? 7 : a;
      var valB = b === 0 ? 7 : b;
      return valA - valB;
    });

    var hasDay = function(arr, d) { return arr.indexOf(d) !== -1; };
    var isMonFri = days.length === 5 && hasDay(days, 1) && hasDay(days, 2) && hasDay(days, 3) && hasDay(days, 4) && hasDay(days, 5);
    if (isMonFri) return "Lunes a Viernes";

    var isMonSat = days.length === 6 && hasDay(days, 1) && hasDay(days, 2) && hasDay(days, 3) && hasDay(days, 4) && hasDay(days, 5) && hasDay(days, 6);
    if (isMonSat) return "Lunes a Sábado";

    var names = {
      1: "Lun", 2: "Mar", 3: "Mié", 4: "Jue", 5: "Vie", 6: "Sáb", 0: "Dom"
    };

    var result = [];
    for (var i = 0; i < sortedDays.length; i++) {
      result.push(names[sortedDays[i]]);
    }
    return result.join(", ");
  };

  // Cálculo en vivo del estado abierto/cerrado
  var now = new Date();
  var day = now.getDay(); // 0: Dom, 1: Lun, etc.
  var isOpen = false;

  if (workDays.indexOf(day) !== -1) {
    var openParts = openTime.split(':');
    var closeParts = closeTime.split(':');
    var openMin = parseInt(openParts[0], 10) * 60 + parseInt(openParts[1], 10);
    var closeMin = parseInt(closeParts[0], 10) * 60 + parseInt(closeParts[1], 10);
    var currentMin = now.getHours() * 60 + now.getMinutes();

    if (currentMin >= openMin && currentMin <= closeMin) {
      isOpen = true;
    }
  }

  var container = document.createElement('div');
  container.id = 'nvx-horario-' + w.id;
  container.className = 'nvx-widget nvx-horario-wrapper';
  container.style.cssText = 'background:' + bgColor + ' !important;border:1.5px solid ' + borderColor + ' !important;border-radius:12px !important;padding:14px 18px !important;margin:12px 0 !important;box-sizing:border-box !important;box-shadow:0 3px 10px rgba(0,0,0,0.03) !important;display:flex !important;align-items:center !important;gap:12px !important;font-family:system-ui,-apple-system,sans-serif !important;color:' + textColor + ' !important;';

  var iconHtml = showIcon ? '<div style="font-size:26px !important;line-height:1 !important;flex-shrink:0 !important;margin-right:4px !important;">⏰</div>' : '';
  var statusBadge = isOpen
    ? '<span style="background:#ecfdf5 !important;color:#059669 !important;font-size:10px !important;font-weight:900 !important;padding:2px 7px !important;border-radius:999px !important;display:inline-flex !important;align-items:center !important;gap:4px !important;margin-bottom:4px !important;"><span style="width:6px !important;height:6px !important;border-radius:50% !important;background:#10B981 !important;display:inline-block !important;"></span>ABIERTO AHORA</span>'
    : '<span style="background:#fef2f2 !important;color:#dc2626 !important;font-size:10px !important;font-weight:900 !important;padding:2px 7px !important;border-radius:999px !important;display:inline-flex !important;align-items:center !important;gap:4px !important;margin-bottom:4px !important;"><span style="width:6px !important;height:6px !important;border-radius:50% !important;background:#ef4444 !important;display:inline-block !important;"></span>CERRADO</span>';

  var mainMsg = isOpen ? openText : closedText;

  container.innerHTML = iconHtml +
    '<div style="flex:1 !important;min-width:0 !important;">' +
      '<div>' + statusBadge + '</div>' +
      '<div style="font-size:13px !important;font-weight:800 !important;line-height:1.3 !important;margin-bottom:3px !important;color:' + textColor + ' !important;">' + mainMsg + '</div>' +
      '<div style="font-size:11px !important;opacity:0.65 !important;font-weight:600 !important;color:' + textColor + ' !important;">Atención: ' + formatWorkDaysLocal(workDays) + ' ' + openTime + ' a ' + closeTime + ' hs.</div>' +
    '</div>';

  // Inserción en el DOM inteligente para Producto y Categorías (v190)
  var targetEl = null;
  var isProductPage = typeof window !== "undefined" && window.LS && window.LS.product;

  if (isProductPage) {
    targetEl = document.querySelector('form[action*="/cart/add"], .js-product-form, .js-product-container, form.js-product-buyform');
    if (targetEl && targetEl.parentNode) {
      targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
    }
  } else if (w.target_type === 'category' || (window.LS && window.LS.category)) {
    targetEl = document.querySelector('.js-product-grid, #product-grid, .product-grid, h1.category-title, h1.header-title, .category-header');
    if (targetEl && targetEl.parentNode) {
      targetEl.parentNode.insertBefore(container, targetEl);
    } else {
      var mainContainer = document.querySelector('main, #content, .main-content, .js-main-content');
      if (mainContainer && mainContainer.firstChild) {
        mainContainer.insertBefore(container, mainContainer.firstChild);
      } else if (document.body) {
        document.body.insertBefore(container, document.body.firstChild);
      }
    }
  } else {
    var generalMain = document.querySelector('main, #content, .main-content, .js-main-content');
    if (generalMain && generalMain.firstChild) {
      generalMain.insertBefore(container, generalMain.firstChild);
    } else if (document.body) {
      document.body.insertBefore(container, document.body.firstChild);
    }
  }

  // Telemetría Nevux
  if (typeof nvxTrack === 'function') {
    nvxTrack(w.id, 'impression');
  }
}
/* ═══════════════════════════════════════════
   WIDGET: CALCULADORA DE AHORRO
   ═══════════════════════════════════════════ */
function renderCalculadoraAhorro(w) {
  if (document.getElementById('nvx-ahorro-' + w.id)) return;

  var cfg = w.config || {};
  var badgeText = cfg.badgeText || "AHORRO EXCLUSIVO";
  var prefixText = cfg.prefixText || "🎉 ¡Ahorrás";
  var suffixText = cfg.suffixText || "comprando hoy!";
  var exampleAmount = cfg.exampleAmount || "$ 14.500";
  var bgColor = cfg.bgColor || "#ecfdf5";
  var textColor = cfg.textColor || "#065f46";
  var borderColor = cfg.borderColor || "#10B981";
  var accentColor = cfg.accentColor || "#059669";
  var position = cfg.position || "below_price";

  // Calcular el ahorro real leyendo precios de Tiendanube
  var displaySavings = exampleAmount;
  try {
    var compareEl = document.querySelector('.js-compare-price-display, .price-compare, .js-price-compare, [data-compare-price], .product-price-compare');
    var currentEl = document.querySelector('.js-price-display, #price_display, .js-price, [data-price], [data-store="product-price"], .product-price');

    if (compareEl && currentEl) {
      var parsePrice = function(txt) {
        if (!txt) return 0;
        var clean = txt.replace(/[^0-9.,]/g, '').replace(/\./g, '').replace(',', '.');
        return parseFloat(clean) || 0;
      };

      var compPrice = parsePrice(compareEl.innerText || compareEl.textContent);
      var currPrice = parsePrice(currentEl.innerText || currentEl.textContent);

      if (compPrice > currPrice && currPrice > 0) {
        var diff = compPrice - currPrice;
        displaySavings = '$ ' + Math.round(diff).toLocaleString('es-AR');
      }
    }
  } catch (e) {
    displaySavings = exampleAmount;
  }

  // Contenedor principal
  var container = document.createElement('div');
  container.id = 'nvx-ahorro-' + w.id;
  container.className = 'nvx-widget nvx-ahorro-wrapper';
  container.style.cssText = 'display:block !important;width:100% !important;clear:both !important;box-sizing:border-box !important;margin:15px 0 !important;';

  var innerContainer = document.createElement('div');
  innerContainer.style.cssText = 'background:' + bgColor + ';border:1.5px solid ' + borderColor + ';border-radius:12px;padding:14px 18px;box-shadow:0 3px 10px rgba(0,0,0,0.03);display:flex;align-items:center;justify-content:space-between;gap:12px;font-family:system-ui,-apple-system,sans-serif;color:' + textColor + ';width:100%;box-sizing:border-box;';

  var badgeHtml = badgeText
    ? '<span style="font-size:10px;font-weight:900;letter-spacing:0.04em;color:' + accentColor + ';text-transform:uppercase;display:block;margin-bottom:2px;">' + badgeText + '</span>'
    : '';

  innerContainer.innerHTML =
    '<div style="flex:1;min-width:0;">' +
      badgeHtml +
      '<div style="font-size:14px;font-weight:700;line-height:1.3;">' +
        prefixText + ' <span style="font-size:16px;font-weight:900;color:' + accentColor + ';text-decoration:underline;">' + displaySavings + '</span> ' + suffixText +
      '</div>' +
    '</div>' +
    '<div style="width:36px;height:36px;border-radius:50%;background:' + accentColor + ';color:#ffffff;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;flex-shrink:0;">%</div>';

  container.appendChild(innerContainer);

  // ═══════════════════════════════════════════
  // SELECTORES UNIVERSALES TIENDANUBE (PROBADO)
  // ═══════════════════════════════════════════
  
  // 1. Imagen / Galería
  var imgEl = document.querySelector('.js-product-image-container, .js-product-slider, .product-image-container, [data-store="product-image-container"], .product-gallery, .js-product-gallery-container');
  if (!imgEl) {
    // Fallback si no encuentra el contenedor, busca la imagen principal y sube 1 nivel
    var rawImg = document.querySelector('img[itemprop="image"], .js-product-featured-image');
    if (rawImg) {
      imgEl = rawImg.parentElement;
    }
  }

  // 2. Precio
  var priceEl = document.querySelector('.js-price-display, #price_display, .js-price-container, .product-price-container, .price-container, [data-store="product-price"]');

  // 3. Formulario de compra (IDÉNTICO EN EL 100% DE TIENDAS)
  var buyForm = document.querySelector('form[action*="/cart/add"], form.js-product-form, form.js-product-buyform, form.product-form');

  var injected = false;

  try {
    if (position === 'below_image' && imgEl) {
      imgEl.parentNode.insertBefore(container, imgEl.nextSibling);
      injected = true;
    } 
    else if (position === 'above_price' && priceEl) {
      var targetPrice = priceEl.closest('div') || priceEl;
      targetPrice.parentNode.insertBefore(container, targetPrice);
      injected = true;
    } 
    else if (position === 'below_price' && priceEl) {
      var targetPrice = priceEl.closest('div') || priceEl;
      targetPrice.parentNode.insertBefore(container, targetPrice.nextSibling);
      injected = true;
    } 
    else if (position === 'above_buy' && buyForm) {
      // Regla #24: Arriba del formulario completo para no chocar con el flex del botón de cantidad
      buyForm.parentNode.insertBefore(container, buyForm);
      injected = true;
    } 
    else if (position === 'below_buy' && buyForm) {
      // Abajo del formulario completo (evita irse abajo de la descripción)
      buyForm.parentNode.insertBefore(container, buyForm.nextSibling);
      injected = true;
    }
  } catch (err) {
    injected = false;
  }

  // Fallback si la plantilla oculta o renombra elementos
  if (!injected) {
    if (priceEl) {
      priceEl.parentNode.insertBefore(container, priceEl.nextSibling);
    } else if (buyForm) {
      buyForm.parentNode.insertBefore(container, buyForm);
    } else {
      var main = document.querySelector('main, #content, .main-content');
      if (main) main.insertBefore(container, main.firstChild);
    }
  }

  // Telemetría Nevux
  if (typeof nvxTrack === 'function') {
    nvxTrack(w.id, 'impression');
  }
      }
      /* ═══════════════════════════════════════════
   WIDGET: STICKER EDICIÓN LIMITADA
   ═══════════════════════════════════════════ */
function renderEdicionLimitada(w) {
  if (document.getElementById('nvx-limitada-' + w.id)) return;

  var cfg = w.config || {};
  if (cfg.mostrarEnProducto === false) return;

  var CAMPAIGN_COLORS = {
    'black-friday': { bg: '#111827', text: '#F59E0B', border: '#F59E0B' },
    'hot-sale': { bg: '#0F172A', text: '#EF4444', border: '#EF4444' },
    'cyber-monday': { bg: '#090D16', text: '#3B82F6', border: '#3B82F6' },
    'navidad': { bg: '#064E3B', text: '#EF4444', border: '#EF4444' },
    'san-valentin': { bg: '#831843', text: '#F43F5E', border: '#F43F5E' },
    'dia-padre-madre': { bg: '#312E81', text: '#10B981', border: '#10B981' },
    'liquidacion': { bg: '#7F1D1D', text: '#FBBF24', border: '#FBBF24' }
  };

  var theme = cfg.campaignTheme && cfg.campaignTheme !== 'none' ? CAMPAIGN_COLORS[cfg.campaignTheme] : null;

  var bg = theme ? theme.bg : (cfg.colorFondo || '#111827');
  var color = theme ? theme.text : (cfg.colorTexto || '#F59E0B');
  var borderColor = theme ? theme.border : (cfg.colorBorde || '#F59E0B');
  var mostrarBorde = cfg.mostrarBorde !== false;
  var textoPrincipal = cfg.textoPrincipal || 'EDICIÓN LIMITADA';
  var subtexto = cfg.subtexto || '';
  var forma = cfg.forma || 'circular';
  var posicion = cfg.posicion || 'esquina-superior-derecha';
  var rotacion = typeof cfg.rotacion === 'number' ? cfg.rotacion : -8;
  var efecto = cfg.efecto || 'brillo-pulsante';
  var tamano = cfg.tamano || 'mediano';

  var scaleMultiplier = tamano === 'chico' ? 0.85 : (tamano === 'grande' ? 1.15 : 1);

  // Inyectar CSS de animaciones si no existe
  if (!document.getElementById('nvx-limitada-style')) {
    var styleTag = document.createElement('style');
    styleTag.id = 'nvx-limitada-style';
    styleTag.innerHTML =
      '@keyframes nvxGlowPulse {' +
      '0%, 100% { box-shadow: 0 4px 14px rgba(0,0,0,0.2), 0 0 0 0 rgba(245, 158, 11, 0.4); }' +
      '50% { box-shadow: 0 6px 20px rgba(0,0,0,0.3), 0 0 0 8px rgba(245, 158, 11, 0); }' +
      '}' +
      '@keyframes nvxZoomPulse {' +
      '0%, 100% { transform: scale(1); }' +
      '50% { transform: scale(1.05); }' +
      '}' +
      '.nvx-glow-pulse { animation: nvxGlowPulse 2.5s infinite ease-in-out; }' +
      '.nvx-zoom-pulse { animation: nvxZoomPulse 2s infinite ease-in-out; }';
    document.head.appendChild(styleTag);
  }

  var animClass = '';
  if (efecto === 'brillo-pulsante') animClass = ' nvx-glow-pulse';
  else if (efecto === 'zoom-suave') animClass = ' nvx-zoom-pulse';

  var container = document.createElement('div');
  container.id = 'nvx-limitada-' + w.id;
  container.className = 'nvx-widget nvx-limitada-wrapper' + animClass;

  var baseTransform = 'rotate(' + rotacion + 'deg) scale(' + scaleMultiplier + ')';

  if (posicion === 'inline-precio') {
    container.style.cssText = 'display:inline-flex;margin:10px 0;z-index:9;transform:' + baseTransform + ';transform-origin:center center;font-family:system-ui,-apple-system,sans-serif;';
  } else {
    var isLeft = posicion === 'esquina-superior-izquierda';
    container.style.cssText = 'position:absolute;top:12px;' + (isLeft ? 'left:12px;' : 'right:12px;') + 'z-index:15;transform:' + baseTransform + ';transform-origin:center center;pointer-events:none;font-family:system-ui,-apple-system,sans-serif;';
  }

  var innerHtml = '';

  if (forma === 'circular') {
    var borderStyle = mostrarBorde ? 'border:2px dashed ' + borderColor + ';' : '';
    innerHtml =
      '<div style="width:84px;height:84px;border-radius:50%;background:' + bg + ';color:' + color + ';' + borderStyle + 'display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:6px;box-shadow:0 4px 14px rgba(0,0,0,0.18);box-sizing:border-box;">' +
        '<span style="font-size:13px;line-height:1;">✨</span>' +
        '<span style="font-size:9.5px;font-weight:900;text-transform:uppercase;letter-spacing:0.04em;line-height:1.1;">' + textoPrincipal + '</span>' +
        (subtexto ? '<span style="font-size:7.5px;opacity:0.9;margin-top:2px;font-weight:700;line-height:1;">' + subtexto + '</span>' : '') +
      '</div>';
  } else if (forma === 'cinta-diagonal') {
    var borderStyle = mostrarBorde ? 'border-top:1.5px solid ' + borderColor + ';border-bottom:1.5px solid ' + borderColor + ';' : '';
    innerHtml =
      '<div style="background:' + bg + ';color:' + color + ';' + borderStyle + 'padding:5px 18px;box-shadow:0 4px 12px rgba(0,0,0,0.15);display:flex;flex-direction:column;align-items:center;text-align:center;">' +
        '<span style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.06em;white-space:nowrap;">✦ ' + textoPrincipal + ' ✦</span>' +
        (subtexto ? '<span style="font-size:7.5px;opacity:0.9;font-weight:700;">' + subtexto + '</span>' : '') +
      '</div>';
  } else if (forma === 'sello-borde') {
    var outlineStyle = mostrarBorde ? 'outline:1.5px dashed ' + borderColor + ';outline-offset:3px;' : '';
    innerHtml =
      '<div style="background:' + bg + ';color:' + color + ';border:2px solid ' + borderColor + ';border-radius:6px;padding:6px 14px;box-shadow:0 3px 10px rgba(0,0,0,0.12);display:flex;flex-direction:column;align-items:center;text-align:center;' + outlineStyle + '">' +
        '<div style="display:flex;align-items:center;gap:4px;">' +
          '<span style="font-size:10px;">🏷️</span>' +
          '<span style="font-size:10.5px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;line-height:1.1;">' + textoPrincipal + '</span>' +
        '</div>' +
        (subtexto ? '<span style="font-size:8px;opacity:0.9;margin-top:3px;font-weight:700;">' + subtexto + '</span>' : '') +
      '</div>';
  } else {
    // badge-rect
    var borderStyle = mostrarBorde ? 'border:1.5px solid ' + borderColor + ';' : '';
    innerHtml =
      '<div style="background:' + bg + ';color:' + color + ';' + borderStyle + 'border-radius:999px;padding:6px 14px;box-shadow:0 3px 10px rgba(0,0,0,0.12);display:flex;align-items:center;gap:6px;text-align:center;">' +
        '<span style="font-size:11px;">🔥</span>' +
        '<div style="display:flex;flex-direction:column;align-items:flex-start;">' +
          '<span style="font-size:10.5px;font-weight:900;text-transform:uppercase;letter-spacing:0.04em;line-height:1.1;">' + textoPrincipal + '</span>' +
          (subtexto ? '<span style="font-size:8px;opacity:0.9;font-weight:700;line-height:1;">' + subtexto + '</span>' : '') +
        '</div>' +
      '</div>';
  }

  container.innerHTML = innerHtml;

  // Inserción en DOM
  if (posicion === 'inline-precio') {
    var priceEl = document.querySelector('.js-price-display, #price_display, .js-price, [data-price], form[action*="/cart/add"], .js-product-form');
    if (priceEl && priceEl.parentNode) {
      priceEl.parentNode.insertBefore(container, priceEl.nextSibling);
    } else {
      var form = document.querySelector('form[action*="/cart/add"], .js-product-form');
      if (form && form.parentNode) form.parentNode.insertBefore(container, form);
    }
  } else {
    // En imagen de producto
    var imgContainer = document.querySelector(
      '.js-product-slider, .product-slider, .js-swiper-container, .swiper-container, .js-product-image-container, .product-image-container, .js-product-image, .image-container, [data-component="product.image"]'
    );
    if (imgContainer) {
      var pos = window.getComputedStyle(imgContainer).position;
      if (pos === 'static' || !pos) imgContainer.style.position = 'relative';
      imgContainer.appendChild(container);
    } else {
      var targetEl = document.querySelector('form[action*="/cart/add"], .js-product-form, .js-product-container');
      if (targetEl && targetEl.parentNode) targetEl.parentNode.insertBefore(container, targetEl);
    }
  }

  // Telemetría Nevux
  if (typeof nvxTrack === 'function') {
    nvxTrack(w.id, 'impression');
  }
    }
      /* ═══════════════════════════════════════════
   WIDGET: CONTADOR DE VENDIDOS
   ═══════════════════════════════════════════ */
function renderContadorVendidos(w) {
  if (document.getElementById('nvx-vendidos-' + w.id)) return;

  var cfg = w.config || {};
  if (cfg.mostrarEnProducto === false) return;

  var CAMPAIGN_COLORS = {
    'black-friday': { bg: '#111827', text: '#F59E0B', border: '#F59E0B', icon: '#F59E0B' },
    'hot-sale': { bg: '#0F172A', text: '#EF4444', border: '#EF4444', icon: '#EF4444' },
    'cyber-monday': { bg: '#090D16', text: '#3B82F6', border: '#3B82F6', icon: '#3B82F6' },
    'navidad': { bg: '#064E3B', text: '#EF4444', border: '#EF4444', icon: '#EF4444' },
    'san-valentin': { bg: '#831843', text: '#F43F5E', border: '#F43F5E', icon: '#F43F5E' },
    'dia-padre-madre': { bg: '#312E81', text: '#10B981', border: '#10B981', icon: '#10B981' },
    'liquidacion': { bg: '#7F1D1D', text: '#FBBF24', border: '#FBBF24', icon: '#FBBF24' }
  };

  var ICON_MAP = {
    fuego: '🔥',
    check: '✅',
    carrito: '🛒',
    paquete: '📦',
    estrella: '⭐',
    personas: '👥',
    cohete: '🚀'
  };

  var theme = cfg.campaignTheme && cfg.campaignTheme !== 'none' ? CAMPAIGN_COLORS[cfg.campaignTheme] : null;

  var bg = theme ? theme.bg : (cfg.colorFondo || '#ecfdf5');
  var textColor = theme ? theme.text : (cfg.colorTexto || '#065f46');
  var iconColor = theme ? theme.icon : (cfg.colorIcono || '#10B981');
  var borderColor = theme ? theme.border : (cfg.colorBorde || '#10B981');
  var iconEmoji = ICON_MAP[cfg.icono] || '🔥';
  var initialCount = typeof cfg.cantidadVendida === 'number' ? cfg.cantidadVendida : 247;
  var texto = cfg.texto || 'vendidos en las últimas 24 horas';
  var estilo = cfg.estiloVisual || 'pildora';
  var posicion = cfg.posicion || 'debajo-precio';
  var fontSize = cfg.fontSize || '13px';
  var puntoPulsante = cfg.puntoPulsante !== false;
  var autoIncrementar = cfg.autoIncrementar !== false;
  var intervaloSegundos = cfg.intervaloSegundos || 45;
  var efecto = cfg.efecto || 'fade-in';

  // Inyectar animaciones si no existen
  if (!document.getElementById('nvx-vendidos-style')) {
    var styleTag = document.createElement('style');
    styleTag.id = 'nvx-vendidos-style';
    styleTag.innerHTML =
      '@keyframes nvxPulseDot {' +
      '0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); transform: scale(1); }' +
      '50% { box-shadow: 0 0 0 5px rgba(239, 68, 68, 0); transform: scale(1.15); }' +
      '}' +
      '@keyframes nvxVendidosFade {' +
      'from { opacity: 0; transform: translateY(6px); }' +
      'to { opacity: 1; transform: translateY(0); }' +
      '}' +
      '@keyframes nvxVendidosSlide {' +
      'from { opacity: 0; transform: translateX(-12px); }' +
      'to { opacity: 1; transform: translateX(0); }' +
      '}' +
      '@keyframes nvxVendidosZoom {' +
      'from { opacity: 0; transform: scale(0.92); }' +
      'to { opacity: 1; transform: scale(1); }' +
      '}' +
      '.nvx-vendidos-pulse-dot { animation: nvxPulseDot 1.8s infinite ease-in-out; }' +
      '.nvx-vendidos-fade { animation: nvxVendidosFade 0.4s ease-out; }' +
      '.nvx-vendidos-slide { animation: nvxVendidosSlide 0.4s ease-out; }' +
      '.nvx-vendidos-zoom { animation: nvxVendidosZoom 0.4s ease-out; }';
    document.head.appendChild(styleTag);
  }

  var animClass = '';
  if (efecto === 'fade-in') animClass = ' nvx-vendidos-fade';
  else if (efecto === 'slide') animClass = ' nvx-vendidos-slide';
  else if (efecto === 'zoom') animClass = ' nvx-vendidos-zoom';

  var container = document.createElement('div');
  container.id = 'nvx-vendidos-' + w.id;
  container.className = 'nvx-widget nvx-vendidos-wrapper' + animClass;

  var baseStyle = 'display:inline-flex;align-items:center;gap:8px;font-size:' + fontSize + ';font-weight:600;color:' + textColor + ';font-family:system-ui,-apple-system,sans-serif;line-height:1.3;margin:8px 0;box-sizing:border-box;';

  if (estilo === 'borde') {
    container.style.cssText = baseStyle + 'background:' + bg + ';border:1.5px solid ' + borderColor + ';border-radius:8px;padding:8px 14px;';
  } else if (estilo === 'tarjeta') {
    container.style.cssText = baseStyle + 'background:' + bg + ';border:1px solid ' + borderColor + ';border-radius:12px;padding:10px 16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);width:100%;';
  } else if (estilo === 'gradiente') {
    container.style.cssText = baseStyle + 'background:linear-gradient(135deg,' + bg + ' 0%,#ffffff 100%);border:1px solid ' + borderColor + ';border-radius:999px;padding:6px 14px;box-shadow:0 2px 6px rgba(0,0,0,0.03);';
  } else {
    // pildora
    container.style.cssText = baseStyle + 'background:' + bg + ';border:1px solid transparent;border-radius:999px;padding:6px 14px;';
  }

  var dotHtml = puntoPulsante
    ? '<span class="nvx-vendidos-pulse-dot" style="width:8px;height:8px;border-radius:50%;background:#ef4444;display:inline-block;flex-shrink:0;"></span>'
    : '';

  var numId = 'nvx-num-' + w.id;

  container.innerHTML =
    dotHtml +
    '<span style="font-size:14px;color:' + iconColor + ';line-height:1;">' + iconEmoji + '</span>' +
    '<div>' +
      '<strong id="' + numId + '" style="font-weight:900;">' + initialCount.toLocaleString('es-AR') + '</strong> ' +
      texto +
    '</div>';

  // Inserción según posición
  if (posicion === 'debajo-titulo') {
    var titleEl = document.querySelector('.js-product-name, .product-name, h1.product-title, h1');
    if (titleEl && titleEl.parentNode) {
      titleEl.parentNode.insertBefore(container, titleEl.nextSibling);
    } else {
      insertDefault(container);
    }
  } else if (posicion === 'debajo-comprar') {
    var buyBtn = document.querySelector('form[action*="/cart/add"] input[type="submit"], form[action*="/cart/add"] button[type="submit"], .js-prod-submit-form, .js-addtocart, form[action*="/cart/add"]');
    if (buyBtn && buyBtn.parentNode) {
      buyBtn.parentNode.insertBefore(container, buyBtn.nextSibling);
    } else {
      insertDefault(container);
    }
  } else {
    // debajo-precio
    var priceEl = document.querySelector('.js-price-display, #price_display, .js-price, [data-price]');
    if (priceEl && priceEl.parentNode) {
      priceEl.parentNode.insertBefore(container, priceEl.nextSibling);
    } else {
      insertDefault(container);
    }
  }

  function insertDefault(el) {
    var target = document.querySelector('form[action*="/cart/add"], .js-product-form, .js-product-container');
    if (target && target.parentNode) {
      target.parentNode.insertBefore(el, target);
    } else {
      var main = document.querySelector('main, #content, .main-content');
      if (main) main.insertBefore(el, main.firstChild);
    }
  }

  // Auto-incremento en vivo
  if (autoIncrementar && intervaloSegundos > 0) {
    var currentCount = initialCount;
    setInterval(function() {
      currentCount += 1;
      var el = document.getElementById(numId);
      if (el) {
        el.innerText = currentCount.toLocaleString('es-AR');
      }
    }, intervaloSegundos * 1000);
  }

  // Telemetría Nevux
  if (typeof nvxTrack === 'function') {
    nvxTrack(w.id, 'impression');
  }
}
              /* ═══════════════════════════════════════════
     SOCIAL PROOF IA — 3 TIPOS + PRODUCTOS REALES ROTATIVOS (v201 BLINDADO)
  ═══════════════════════════════════════════ */
  function renderSocialProof(spData) {
    var nsPrefix = typeof NS !== "undefined" ? NS : "nvx";
    var rootId = nsPrefix + "-social-proof-root";

    // 1. Eliminar de inmediato cualquier contenedor existente si la función viene desactivada
    var existingContainer = document.getElementById(rootId);
    if (existingContainer && existingContainer.parentNode) {
      existingContainer.parentNode.removeChild(existingContainer);
    }

    // 2. Filtro ultra-estricto de desactivación (Blindaje total)
    if (!spData) return;
    if (spData.is_active === false || spData.is_active === "false" || !spData.is_active) return;
    if (spData.user_disabled === true || spData.user_disabled === "true") return;
    if (spData.config && (spData.config.user_disabled === true || spData.config.user_disabled === "true" || spData.config.is_active === false || spData.config.is_active === "false")) return;

    var container = document.createElement("div");
    container.id = rootId;
    container.className = nsPrefix + "-root";

    var pos = (spData.config && spData.config.position) || spData.position || "bottom-left";
    var posStyles = "position:fixed !important;z-index:999995 !important;max-width:290px !important;width:calc(100% - 32px) !important;pointer-events:none !important;display:block !important;box-sizing:border-box !important;";

    if (pos.indexOf("bottom") !== -1) posStyles += "bottom:16px !important;";
    if (pos.indexOf("top") !== -1) posStyles += "top:16px !important;";
    if (pos.indexOf("left") !== -1) posStyles += "left:16px !important;";
    if (pos.indexOf("right") !== -1) posStyles += "right:16px !important;";

    container.style.cssText = posStyles;

    if (document.body) {
      document.body.appendChild(container);
    } else {
      return;
    }

    // Helper: validar que una URL de imagen sea real (no placeholder ni data:image)
    var isValidImg = function(src) {
      if (!src || typeof src !== "string") return false;
      var s = src.trim();
      if (s.length < 5) return false;
      if (s.indexOf("data:image") === 0) return false;
      if (s.indexOf("blank.gif") !== -1 || s.indexOf("pixel") !== -1 || s.indexOf("spacer") !== -1) return false;
      return true;
    };

    // 1. Producto actual si está en ficha de producto
    var currentProdImg = "";
    var currentProdName = "";
    if (typeof window !== "undefined" && window.LS && window.LS.product) {
      currentProdName = window.LS.product.name || "";
      if (window.LS.product.images && window.LS.product.images.length > 0) {
        var imgObj = window.LS.product.images[0];
        var cand = typeof imgObj === "string" ? imgObj : (imgObj.src || imgObj.url || "");
        if (isValidImg(cand)) currentProdImg = cand;
      } else if (isValidImg(window.LS.product.image)) {
        currentProdImg = window.LS.product.image;
      }
    }

    // 2. Escáner de productos reales de la tienda (para Home y Catálogo)
    var scrapedProducts = [];
    try {
      var prodEls = document.querySelectorAll(".js-item-product, .item-product, .product-item, .grid-item, [data-product-id], article.product");
      for (var p = 0; p < prodEls.length; p++) {
        var el = prodEls[p];
        var nameEl = el.querySelector(".item-name, .product-title, .title, h2, h3, a[title]");
        var imgEl = el.querySelector("img[src], img[data-src]");
        var pName = nameEl ? (nameEl.getAttribute("title") || nameEl.innerText || "").trim() : "";
        var pImg = "";
        if (imgEl) {
          var rawSrc = imgEl.getAttribute("src") || imgEl.getAttribute("data-src") || "";
          if (isValidImg(rawSrc)) pImg = rawSrc;
        }
        if (pName && pImg) {
          scrapedProducts.push({ name: pName, image: pImg });
        }
      }
    } catch (eScan) {}

    // Helper: obtener producto aleatorio del escáner
    var lastRndIdx = -1;
    var getRandomProduct = function() {
      if (scrapedProducts.length === 0) return null;
      var rIdx = Math.floor(Math.random() * scrapedProducts.length);
      if (scrapedProducts.length > 1 && rIdx === lastRndIdx) {
        rIdx = (rIdx + 1) % scrapedProducts.length;
      }
      lastRndIdx = rIdx;
      return scrapedProducts[rIdx];
    };

    var buyers = [
      { name: "Sofía M.", city: "Palermo, CABA" },
      { name: "Martín G.", city: "Córdoba Capital" },
      { name: "Lucía R.", city: "Rosario, Santa Fe" },
      { name: "Valentina D.", city: "Belgrano, CABA" },
      { name: "Joaquín B.", city: "Mendoza" },
      { name: "Camila S.", city: "La Plata" },
      { name: "Mateo P.", city: "San Isidro" }
    ];

    // Construir eventos dinámicamente
    var buildEvents = function() {
      var rndA = getRandomProduct();
      var rndB = getRandomProduct();

      var saleName = currentProdName || (rndA ? rndA.name : "un producto destacado");
      var saleImg = currentProdImg || (rndA ? rndA.image : "");

      var sale2Name = currentProdName || (rndB ? rndB.name : "una oferta del día");
      var sale2Img = currentProdImg || (rndB ? rndB.image : "");

      return [
        {
          type: "sale",
          title: buyers[0].name + " de " + buyers[0].city,
          subtitle: "Compró " + saleName,
          badge: "⚡ Compra verificada",
          icon: "🛍️",
          image: saleImg
        },
        {
          type: "visitors",
          title: (Math.floor(Math.random() * 18) + 14) + " personas mirando ahora",
          subtitle: currentProdName ? "Interesados en este producto" : "Viendo productos de la tienda",
          badge: "🔥 Tendencia en vivo",
          icon: "👀",
          image: ""
        },
        {
          type: "stock",
          title: "¡Últimas " + (Math.floor(Math.random() * 3) + 2) + " unidades!",
          subtitle: "Alta demanda en las últimas horas",
          badge: "⚠️ Se agota rápido",
          icon: "📦",
          image: ""
        },
        {
          type: "sale",
          title: buyers[1].name + " de " + buyers[1].city,
          subtitle: "Compró " + sale2Name,
          badge: "⚡ Envío despachado",
          icon: "🚀",
          image: sale2Img
        }
      ];
    };

    var events = buildEvents();
    var currentIdx = 0;
    var displayMs = ((spData.config && spData.config.displayTime) || spData.display_duration || 5) * 1000;
    var delayMs = ((spData.config && spData.config.delayBetween) || spData.delay_between || 7) * 1000;
    var theme = (spData.config && spData.config.theme_style) || spData.theme_style || "dark";

    var safeEscape = function(str) {
      if (!str) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    var showNextEvent = function() {
      if (!events || events.length === 0) return;

      if (currentIdx === 0) {
        events = buildEvents();
      }

      var ev = events[currentIdx];
      currentIdx = (currentIdx + 1) % events.length;

      var bgStyle = "#ffffff";
      var textColor = "#111827";
      var subColor = "#6b7280";
      var borderStyle = "1px solid #e5e7eb";

      if (theme === "dark") {
        bgStyle = "#111827";
        textColor = "#ffffff";
        subColor = "#9ca3af";
        borderStyle = "1px solid #374151";
      }

      var cardId = nsPrefix + "-sp-card";
      var closeId = nsPrefix + "-sp-close";

      var visualMediaHtml = "";
      if (ev.type === "sale" && isValidImg(ev.image)) {
        visualMediaHtml = '<img src="' + safeEscape(ev.image) + '" style="width:40px !important;height:40px !important;object-fit:cover !important;border-radius:9px !important;border:' + borderStyle + ' !important;flex-shrink:0 !important;display:block !important;background:#fff !important;" />';
      } else {
        visualMediaHtml = '<div style="width:40px !important;height:40px !important;border-radius:9px !important;background:' + (theme === "dark" ? "#1f2937" : "#f3f4f6") + ' !important;display:flex !important;align-items:center !important;justify-content:center !important;font-size:22px !important;flex-shrink:0 !important;">' + ev.icon + '</div>';
      }

      var cardHtml = '<div id="' + cardId + '" style="' +
        'background:' + bgStyle + ' !important;' +
        'color:' + textColor + ' !important;' +
        'border:' + borderStyle + ' !important;' +
        'border-radius:14px !important;' +
        'padding:10px 12px !important;' +
        'display:flex !important;' +
        'align-items:center !important;' +
        'gap:10px !important;' +
        'box-shadow:0 10px 25px rgba(0,0,0,0.22) !important;' +
        'pointer-events:auto !important;' +
        'transition:all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;' +
        'transform:translateY(20px) !important;' +
        'opacity:0 !important;' +
        'box-sizing:border-box !important;' +
        'font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif !important;' +
        'margin:0 !important;' +
        'width:100% !important;' +
        '">' +
        visualMediaHtml +
        '<div style="flex:1 !important;min-width:0 !important;text-align:left !important;">' +
          '<div style="font-size:11.5px !important;font-weight:700 !important;line-height:1.25 !important;overflow:hidden !important;text-overflow:ellipsis !important;white-space:nowrap !important;color:' + textColor + ' !important;margin:0 !important;">' + safeEscape(ev.title) + '</div>' +
          '<div style="font-size:10.5px !important;color:' + subColor + ' !important;line-height:1.25 !important;margin-top:1px !important;overflow:hidden !important;text-overflow:ellipsis !important;white-space:nowrap !important;">' + safeEscape(ev.subtitle) + '</div>' +
          '<div style="font-size:9.5px !important;color:#10B981 !important;font-weight:700 !important;margin-top:2px !important;display:flex !important;align-items:center !important;gap:2px !important;">' + safeEscape(ev.badge) + '</div>' +
        '</div>' +
        '<button type="button" id="' + closeId + '" style="background:transparent !important;border:none !important;color:' + subColor + ' !important;cursor:pointer !important;padding:2px !important;font-size:13px !important;line-height:1 !important;margin-left:2px !important;flex-shrink:0 !important;outline:none !important;">✕</button>' +
      '</div>';

      container.innerHTML = cardHtml;

      var cardEl = document.getElementById(cardId);
      var closeBtn = document.getElementById(closeId);

      if (closeBtn) {
        closeBtn.onclick = function(e) {
          if (e && e.stopPropagation) e.stopPropagation();
          if (cardEl) {
            cardEl.style.setProperty("opacity", "0", "important");
            cardEl.style.setProperty("transform", "translateY(20px)", "important");
          }
        };
      }

      setTimeout(function() {
        if (cardEl) {
          cardEl.style.setProperty("opacity", "1", "important");
          cardEl.style.setProperty("transform", "translateY(0px)", "important");
        }
      }, 80);

      setTimeout(function() {
        if (cardEl) {
          cardEl.style.setProperty("opacity", "0", "important");
          cardEl.style.setProperty("transform", "translateY(20px)", "important");
        }
        setTimeout(showNextEvent, delayMs);
      }, displayMs);
    };

    setTimeout(showNextEvent, 1200);
}
/* ═══════════════════════════════════════════
   WIDGET: CUENTA REGRESIVA (v16 - 11 Plantillas)
   ═══════════════════════════════════════════ */
function renderCuentaRegresiva(w) {
  var elementId = "nvx-timer-" + w.id;
  if (document.getElementById(elementId)) return;

  var cfg = w.config || {};
  var location = cfg.location || "product_before";

  // Verificación estricta: si la ubicación no es Top Bar, SOLO se ejecuta dentro de la Ficha de Producto
  var currentPage = typeof detectPageType === "function" ? detectPageType() : "";
  if (location !== "top_bar" && currentPage !== "product") {
    return;
  }

  var timerType = cfg.timerType || "minutes";
  var durationMinutes = parseInt(cfg.durationMinutes, 10) || 15;
  var exactDate = cfg.exactDate || "";
  var title = cfg.title || "¡Oferta por tiempo limitado!";
  var blockSize = cfg.blockSize || "normal";
  var template = cfg.template || "classic";
  var gradStart = cfg.gradStart || "#111827";
  var gradEnd = cfg.gradEnd || "#10B981";
  var textColor = cfg.textColor || "#ffffff";
  var coupon = cfg.coupon || "";
  var ctaText = cfg.ctaText || "";
  var ctaUrl = cfg.ctaUrl || "";

  // Presets de campaña
  var THEMES = {
    "black-friday": { start: "#111827", end: "#F59E0B", text: "#ffffff" },
    "hot-sale": { start: "#0F172A", end: "#EF4444", text: "#ffffff" },
    "cyber-monday": { start: "#090D16", end: "#3B82F6", text: "#ffffff" },
    "navidad": { start: "#064E3B", end: "#EF4444", text: "#ffffff" },
    "san-valentin": { start: "#831843", end: "#F43F5E", text: "#ffffff" },
    "dia-padre-madre": { start: "#312E81", end: "#10B981", text: "#ffffff" },
    "liquidacion": { start: "#7F1D1D", end: "#FBBF24", text: "#ffffff" }
  };

  if (cfg.campaignTheme && cfg.campaignTheme !== "none" && THEMES[cfg.campaignTheme]) {
    var t = THEMES[cfg.campaignTheme];
    gradStart = t.start;
    gradEnd = t.end;
    textColor = t.text;
  }

  // Lógica de tiempo objetivo: storageKey vinculada a la configuración actual
  var targetTime = 0;
  var cleanDate = exactDate ? exactDate.replace(/[^a-zA-Z0-9]/g, "") : "";
  var storageKey = "nvx_timer_end_" + w.id + "_" + timerType + "_" + durationMinutes + "_" + cleanDate;

  if (timerType === "date" && exactDate) {
    targetTime = new Date(exactDate).getTime();
  } else if (timerType === "daily") {
    var now = new Date();
    var endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    targetTime = endOfDay.getTime();
  } else {
    var savedEnd = null;
    try {
      savedEnd = localStorage.getItem(storageKey);
    } catch (e) {}

    if (savedEnd && parseInt(savedEnd, 10) > new Date().getTime()) {
      targetTime = parseInt(savedEnd, 10);
    } else {
      targetTime = new Date().getTime() + durationMinutes * 60 * 1000;
      try {
        localStorage.setItem(storageKey, targetTime.toString());
      } catch (e) {}
    }
  }

  // Determinar unidades a renderizar dinámicamente según configuración y duración
  var showDays = false;
  var showHours = false;

  var unit = cfg.durationUnit;
  if (!unit) {
    if (durationMinutes >= 1440) unit = "days";
    else if (durationMinutes >= 60) unit = "hours";
    else unit = "minutes";
  }

  if (timerType === "date" && exactDate) {
    var initialDiff = targetTime - new Date().getTime();
    if (initialDiff >= 24 * 60 * 60 * 1000) {
      showDays = true;
      showHours = true;
    } else if (initialDiff >= 60 * 60 * 1000) {
      showHours = true;
    }
  } else if (timerType === "daily") {
    showHours = true;
  } else {
    if (unit === "days" || durationMinutes >= 1440) {
      showDays = true;
      showHours = true;
    } else if (unit === "hours" || durationMinutes >= 60) {
      showHours = true;
    }
  }

  // Dimensiones según blockSize
  var padCss = "18px 22px";
  var titleSize = "16px";
  var digitSize = "20px";
  var digitPad = "6px 11px";

  if (blockSize === "compact") {
    padCss = "12px 16px";
    titleSize = "14px";
    digitSize = "16px";
    digitPad = "4px 8px";
  } else if (blockSize === "large") {
    padCss = "24px 28px";
    titleSize = "19px";
    digitSize = "24px";
    digitPad = "8px 14px";
  }

  // Estilos según Template
  var borderRadiusCss = "16px";
  if (template === "pill") {
    borderRadiusCss = "999px";
  } else if (template === "blocks" || template === "minimal") {
    borderRadiusCss = "0px";
  }

  var bgVal = gradStart;
  if (template === "gradient") {
    bgVal = "linear-gradient(135deg, " + gradStart + ", " + gradEnd + ")";
  } else if (template === "glass") {
    bgVal = "rgba(17,24,39,0.85)";
  } else if (template === "outline") {
    bgVal = "transparent";
  } else if (template === "neon") {
    bgVal = "#000000";
  }

  var borderVal = "none !important;";
  if (template === "outline") {
    borderVal = "2px dashed " + gradEnd + " !important;";
  } else if (template === "neon") {
    borderVal = "2px solid " + gradEnd + " !important;";
  } else if (template === "blocks") {
    borderVal = "none !important; border-left: 8px solid " + gradEnd + " !important;";
  } else if (template === "minimal") {
    borderVal = "none !important; border-top: 1px solid " + gradEnd + " !important; border-bottom: 1px solid " + gradEnd + " !important;";
  }

  var digitBg = gradEnd;
  var digitBorder = "none";
  var digitShadow = "none";
  var digitTextColor = textColor;

  if (template === "gradient") {
    digitBg = "rgba(0,0,0,0.22)";
  } else if (template === "glass") {
    digitBg = "rgba(255,255,255,0.12)";
    digitBorder = "1px solid rgba(255,255,255,0.2)";
  } else if (template === "outline") {
    digitBg = "transparent";
    digitBorder = "2px solid " + gradEnd;
  } else if (template === "neon") {
    digitBg = "transparent";
    digitBorder = "2px solid " + gradEnd;
    digitShadow = "0 0 10px " + gradEnd;
    digitTextColor = gradEnd;
  } else if (template === "minimal") {
    digitBg = "transparent";
  } else if (template === "cards") {
    digitShadow = "0 2px 6px rgba(0,0,0,0.15)";
  }

  var digitRadius = "8px";
  if (template === "pill") digitRadius = "999px";
  if (template === "minimal" || template === "outline" || template === "blocks") digitRadius = "0px";

  // Inyección CSS
  var styleId = "style-" + elementId;
  if (!document.getElementById(styleId)) {
    var styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.type = "text/css";
    var cssText =
      "#" + elementId + " { " +
        "background: " + bgVal + " !important; " +
        borderVal + " " +
        "border-radius: " + borderRadiusCss + " !important; " +
        "padding: " + padCss + " !important; " +
        "color: " + textColor + " !important; " +
        "box-sizing: border-box !important;" +
        (template === "neon" ? "box-shadow: 0 0 15px " + gradEnd + "60 !important;" : "") +
      "} " +
      "#" + elementId + " .nvx-text { " +
        "color: " + (template === "neon" ? gradEnd : textColor) + " !important; " +
      "} " +
      "#" + elementId + " .nvx-digit { " +
        "color: " + digitTextColor + " !important; " +
        "background: " + digitBg + " !important; " +
        "border: " + digitBorder + " !important; " +
        "box-shadow: " + digitShadow + " !important; " +
        "border-radius: " + digitRadius + " !important; " +
        "position: relative !important; " +
        "overflow: hidden !important; " +
      "}";

    styleEl.appendChild(document.createTextNode(cssText));
    document.head.appendChild(styleEl);
  }

  var container = document.createElement("div");
  container.id = elementId;
  container.className = "nvx-widget nvx-timer-wrapper";
  container.style.cssText =
    "margin:14px 0 !important;" +
    "box-shadow:0 8px 24px rgba(0,0,0,0.08) !important;" +
    "display:flex !important;" +
    "flex-direction:column !important;" +
    "align-items:center !important;" +
    "justify-content:center !important;" +
    "gap:12px !important;" +
    "font-family:system-ui,-apple-system,sans-serif !important;" +
    "text-align:center !important;" +
    "width:100% !important;";

  var safeTitle = typeof escapeHtml === "function" ? escapeHtml(title) : title;
  var titleHtml = title ? '<div class="nvx-text" style="font-size:' + titleSize + ';font-weight:800;line-height:1.2;">' + safeTitle + '</div>' : '';

  var couponHtml = "";
  if (coupon) {
    var safeCoupon = typeof escapeHtml === "function" ? escapeHtml(coupon) : coupon;
    couponHtml = '<div id="' + elementId + '-coupon" class="nvx-text" style="background:rgba(255,255,255,0.2) !important;border:1px dashed rgba(255,255,255,0.6) !important;border-radius:6px !important;padding:4px 10px !important;font-size:12px !important;font-weight:800 !important;letter-spacing:0.05em !important;cursor:pointer !important;user-select:none !important;">🎟️ CUPÓN: ' + safeCoupon + ' <span style="font-weight:600;opacity:0.8;">(Copiar)</span></div>';
  }

  var ctaHtml = "";
  if (ctaText && ctaUrl) {
    var safeCtaText = typeof escapeHtml === "function" ? escapeHtml(ctaText) : ctaText;
    var safeCtaUrl = typeof escapeHtml === "function" ? escapeHtml(ctaUrl) : ctaUrl;
    ctaHtml = '<a href="' + safeCtaUrl + '" target="_blank" style="background:#ffffff !important;color:#111827 !important;border-radius:999px !important;padding:6px 16px !important;font-size:12px !important;font-weight:800 !important;text-decoration:none !important;display:inline-block !important;box-shadow:0 2px 6px rgba(0,0,0,0.15) !important;">' + safeCtaText + ' →</a>';
  }

  var flipLineHtml = template === "flip" ? '<div style="position:absolute;top:50%;left:0;right:0;height:1px;background:rgba(255,255,255,0.35);z-index:1;"></div>' : '';

  // Construcción dinámica de dígitos adaptativos
  var digitsHtml = '<div style="display:flex;align-items:center;gap:8px;justify-content:center;">';

  if (showDays) {
    digitsHtml +=
      '<div style="display:flex;flex-direction:column;align-items:center;">' +
        '<div id="' + elementId + '-d" class="nvx-digit" style="padding:' + digitPad + ';font-size:' + digitSize + ';font-weight:900;font-family:monospace;">' + flipLineHtml + '<span style="position:relative;z-index:2;">00</span></div>' +
        '<span class="nvx-text" style="font-size:9px;text-transform:uppercase;opacity:0.8;margin-top:3px;font-weight:700;">Días</span>' +
      '</div>' +
      '<span class="nvx-text" style="font-size:18px;font-weight:900;opacity:0.8;">:</span>';
  }

  if (showHours) {
    digitsHtml +=
      '<div style="display:flex;flex-direction:column;align-items:center;">' +
        '<div id="' + elementId + '-h" class="nvx-digit" style="padding:' + digitPad + ';font-size:' + digitSize + ';font-weight:900;font-family:monospace;">' + flipLineHtml + '<span style="position:relative;z-index:2;">00</span></div>' +
        '<span class="nvx-text" style="font-size:9px;text-transform:uppercase;opacity:0.8;margin-top:3px;font-weight:700;">Horas</span>' +
      '</div>' +
      '<span class="nvx-text" style="font-size:18px;font-weight:900;opacity:0.8;">:</span>';
  }

  digitsHtml +=
    '<div style="display:flex;flex-direction:column;align-items:center;">' +
      '<div id="' + elementId + '-m" class="nvx-digit" style="padding:' + digitPad + ';font-size:' + digitSize + ';font-weight:900;font-family:monospace;">' + flipLineHtml + '<span style="position:relative;z-index:2;">00</span></div>' +
      '<span class="nvx-text" style="font-size:9px;text-transform:uppercase;opacity:0.8;margin-top:3px;font-weight:700;">Min</span>' +
    '</div>' +
    '<span class="nvx-text" style="font-size:18px;font-weight:900;opacity:0.8;">:</span>' +
    '<div style="display:flex;flex-direction:column;align-items:center;">' +
      '<div id="' + elementId + '-s" class="nvx-digit" style="padding:' + digitPad + ';font-size:' + digitSize + ';font-weight:900;font-family:monospace;">' + flipLineHtml + '<span style="position:relative;z-index:2;">00</span></div>' +
      '<span class="nvx-text" style="font-size:9px;text-transform:uppercase;opacity:0.8;margin-top:3px;font-weight:700;">Seg</span>' +
    '</div>' +
  '</div>';

  container.innerHTML = titleHtml + digitsHtml + couponHtml + ctaHtml;

  // Inserción en la página
  if (location === "top_bar") {
    container.style.borderRadius = "0px";
    container.style.margin = "0px";
    container.style.position = "relative";
    container.style.zIndex = "999999";
    var body = document.body;
    if (body) body.insertBefore(container, body.firstChild);
  } else {
    var buyFormSelectors = [
      "form[action*='/cart/add']",
      "form.js-product-form",
      ".js-product-buy-container",
      ".product-buy-container",
      "form.js-product-buyform",
      ".js-add-to-cart-btn",
      ".product-form",
      "#product_form"
    ];

    var buyFormTarget = null;
    for (var b = 0; b < buyFormSelectors.length; b++) {
      var el = document.querySelector(buyFormSelectors[b]);
      if (el) {
        buyFormTarget = el;
        break;
      }
    }

    if (buyFormTarget && buyFormTarget.parentNode) {
      if (location === "product_after") {
        buyFormTarget.parentNode.insertBefore(container, buyFormTarget.nextSibling);
      } else {
        buyFormTarget.parentNode.insertBefore(container, buyFormTarget);
      }
    } else {
      var main = document.querySelector("main, #content, .main-content, .js-product-container");
      if (main) {
        main.insertBefore(container, main.firstChild);
      } else if (document.body) {
        document.body.insertBefore(container, document.body.firstChild);
      }
    }
  }

  // Evento para copiar cupón
  if (coupon) {
    var couponBtn = document.getElementById(elementId + "-coupon");
    if (couponBtn) {
      couponBtn.addEventListener("click", function() {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(coupon);
        } else {
          var input = document.createElement("input");
          input.value = coupon;
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          document.body.removeChild(input);
        }
        couponBtn.innerHTML = "✅ ¡CUPÓN COPIADO!";
        setTimeout(function() {
          couponBtn.innerHTML = "🎟️ CUPÓN: " + safeCoupon + ' <span style="font-weight:600;opacity:0.8;">(Copiar)</span>';
        }, 2500);
      });
    }
  }

  // Bucle de actualización en tiempo real
  function updateTimer() {
    var now = new Date().getTime();
    var diff = targetTime - now;

    if (diff <= 0) {
      diff = 0;
    }

    var d = Math.floor(diff / (1000 * 60 * 60 * 24));
    var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var s = Math.floor((diff % (1000 * 60)) / 1000);

    var dEl = document.getElementById(elementId + "-d");
    var hEl = document.getElementById(elementId + "-h");
    var mEl = document.getElementById(elementId + "-m");
    var sEl = document.getElementById(elementId + "-s");

    function setVal(el, val) {
      if (!el) return;
      var strVal = (val < 10 ? "0" : "") + val;
      var span = el.querySelector("span");
      if (span) {
        span.textContent = strVal;
      } else {
        el.textContent = strVal;
      }
    }

    setVal(dEl, d);
    setVal(hEl, h);
    setVal(mEl, m);
    setVal(sEl, s);
  }

  updateTimer();
  setInterval(updateTimer, 1000);

  // Telemetría Nevux
  if (typeof nvxTrack === "function") {
    nvxTrack(w.id, "impression");
  }
}
/* ═══════════════════════════════════════════
   WIDGET: INFORMACIÓN DE DESPACHO (v193 - COMPLETA Y SEGURA)
   ═══════════════════════════════════════════ */
function renderInfoDespacho(w) {
  var elementId = "nvx-despacho-" + w.id;
  if (document.getElementById(elementId)) return;

  var cfg = w.config || {};
  var showTimer = typeof cfg.showTimer === "boolean" ? cfg.showTimer : true;
  var textBeforeCutoff = cfg.textBeforeCutoff || "Comprando ahora tu pedido se despacha {{dia}}";
  var textAfterCutoff = cfg.textAfterCutoff || "Tu pedido se despacha {{dia}}";
  var timerPrefixText = cfg.timerPrefixText || "Te quedan";
  var cutoffTime = cfg.cutoffTime || "13:00";
  var bgColor = cfg.bgColor || "#10B981";
  var textColor = cfg.textColor || "#ffffff";
  var badgeBgColor = cfg.badgeBgColor || "rgba(255, 255, 255, 0.25)";
  var designStyle = cfg.designStyle || "full";
  var location = cfg.location || "product_before";

  // Presets de campaña
  var THEMES = {
    "black-friday": { bg: "#111827", text: "#ffffff", badge: "#F59E0B" },
    "hot-sale": { bg: "#0F172A", text: "#ffffff", badge: "#EF4444" },
    "cyber-monday": { bg: "#090D16", text: "#ffffff", badge: "#3B82F6" },
    "navidad": { bg: "#064E3B", text: "#ffffff", badge: "#EF4444" },
    "san-valentin": { bg: "#831843", text: "#ffffff", badge: "#F43F5E" },
    "dia-padre-madre": { bg: "#312E81", text: "#ffffff", badge: "#10B981" },
    "liquidacion": { bg: "#7F1D1D", text: "#ffffff", badge: "#FBBF24" }
  };

  if (cfg.campaignTheme && THEMES[cfg.campaignTheme]) {
    var t = THEMES[cfg.campaignTheme];
    bgColor = t.bg;
    textColor = t.text;
    badgeBgColor = t.badge;
  }

  // Estilos del contenedor
  var bgStyle = "background:" + bgColor + ";";
  var borderStyle = "border:none;";
  var borderRadius = "14px";
  var actualTextColor = textColor;

  if (designStyle === "pill") {
    borderRadius = "999px";
  } else if (designStyle === "bordered") {
    bgStyle = "background:#ffffff;";
    borderStyle = "border:2px solid " + bgColor + ";";
    actualTextColor = "#111827";
  } else if (designStyle === "none") {
    bgStyle = "background:transparent;";
    borderStyle = "border:none;";
    actualTextColor = "#111827";
  }

  var container = document.createElement("div");
  container.id = elementId;
  container.className = "nvx-widget nvx-despacho-wrapper";
  container.style.cssText = bgStyle + borderStyle +
    "border-radius:" + borderRadius + ";" +
    "padding:14px 18px;" +
    "margin:12px 0;" +
    "box-sizing:border-box;" +
    "box-shadow:" + (designStyle === "none" ? "none" : "0 4px 14px rgba(0,0,0,0.06)") + ";" +
    "display:flex;" +
    "align-items:center;" +
    "justify-content:space-between;" +
    "gap:14px;" +
    "font-family:system-ui,-apple-system,sans-serif;" +
    "color:" + actualTextColor + ";" +
    "width:100%;";

  var timerBadgeHtml = "";
  if (showTimer) {
    timerBadgeHtml =
      '<div style="background:' + badgeBgColor + ';border-radius:10px;padding:8px 12px;text-align:center;flex-shrink:0;display:flex;flex-direction:column;align-items:center;">' +
        '<span style="font-size:10px;font-weight:700;opacity:0.85;text-transform:uppercase;">' + timerPrefixText + '</span>' +
        '<span id="' + elementId + '-timer-text" style="font-size:16px;font-weight:900;font-family:monospace;margin-top:1px;">--h --m</span>' +
      '</div>';
  }

  container.innerHTML =
    '<div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">' +
      '<span style="font-size:22px;flex-shrink:0;">📦</span>' +
      '<div id="' + elementId + '-msg" style="font-size:15px;font-weight:800;line-height:1.3;">' +
        'Cargando despacho...' +
      '</div>' +
    '</div>' +
    timerBadgeHtml;

  // Búsqueda quirúrgica del bloque del botón de compra
  var buyFormSelectors = [
    "form[action*='/cart/add']",
    "form.js-product-form",
    ".js-product-buy-container",
    ".product-buy-container",
    "form.js-product-buyform",
    ".js-add-to-cart-btn"
  ];

  var buyFormTarget = null;
  for (var b = 0; b < buyFormSelectors.length; b++) {
    var el = document.querySelector(buyFormSelectors[b]);
    if (el) {
      buyFormTarget = el;
      break;
    }
  }

  // DETECCION DE ENTORNO SEGURO PARA LA INYECCIÓN
  var isProductPage = typeof window !== "undefined" && window.LS && window.LS.product;

  if (!isProductPage && (w.target_type === 'category' || (window.LS && window.LS.category))) {
    // 🎯 INYECCIÓN ULTRA-SEGURA ARRIBA DEL LISTADO DE CATEGORÍAS (Evita quedar oculto en el body)
    var catTarget = document.querySelector('.js-product-grid, #product-grid, .product-grid, .product-list, h1.category-title, h1.header-title, .category-header, #products');
    if (catTarget && catTarget.parentNode) {
      catTarget.parentNode.insertBefore(container, catTarget);
    } else {
      var fallbackMain = document.querySelector("main, #content, .main-content, .js-main-content");
      if (fallbackMain && fallbackMain.firstChild) {
        fallbackMain.insertBefore(container, fallbackMain.firstChild);
      } else if (document.body) {
        document.body.insertBefore(container, document.body.firstChild);
      }
    }
  } else {
    // 🎯 INYECCIÓN TRADICIONAL EN FICHA DE PRODUCTO O CARRITO
    if (location === "cart") {
      var cartSelectors = [
        "[data-store='cart-form']",
        ".js-cart-form",
        "#cart-form",
        ".cart-table",
        ".cart-summary",
        ".js-cart-container",
        ".js-ajax-cart-container",
        ".js-checkout-button",
        "[data-store='cart-checkout-button']",
        "form[action*='/cart']"
      ];

      var cartTarget = null;
      for (var c = 0; c < cartSelectors.length; c++) {
        var found = document.querySelector(cartSelectors[c]);
        if (found) {
          cartTarget = found;
          break;
        }
      }

      if (cartTarget && cartTarget.parentNode) {
        cartTarget.parentNode.insertBefore(container, cartTarget);
      } else if (buyFormTarget && buyFormTarget.parentNode) {
        buyFormTarget.parentNode.insertBefore(container, buyFormTarget);
      } else {
        var mainCart = document.querySelector("main, #content, .main-content");
        if (mainCart) mainCart.insertBefore(container, mainCart.firstChild);
      }
    } else if (location === "product_after") {
      if (buyFormTarget && buyFormTarget.parentNode) {
        buyFormTarget.parentNode.insertBefore(container, buyFormTarget.nextSibling);
      } else {
        var mainProdA = document.querySelector("main, #content, .main-content");
        if (mainProdA) mainProdA.appendChild(container);
      }
    } else {
      // product_before (Default: justo arriba del botón/formulario de compra)
      if (buyFormTarget && buyFormTarget.parentNode) {
        buyFormTarget.parentNode.insertBefore(container, buyFormTarget);
      } else {
        var mainProdB = document.querySelector("main, #content, .main-content");
        if (mainProdB) mainProdB.insertBefore(container, mainProdB.firstChild);
      }
    }
  }

  // Lógica de cálculo en vivo para corte y despacho
  function updateDespachoInfo() {
    var now = new Date();
    var parts = cutoffTime.split(":");
    var cutH = parseInt(parts[0], 10) || 13;
    var cutM = parseInt(parts[1], 10) || 0;

    var cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), cutH, cutM, 0);
    var diff = cutoffDate.getTime() - now.getTime();
    var isBeforeCutoff = diff > 0;

    if (!isBeforeCutoff) {
      var tomorrowCutoff = new Date(cutoffDate.getTime() + 24 * 60 * 60 * 1000);
      diff = tomorrowCutoff.getTime() - now.getTime();
    }

    var h = Math.floor(diff / (1000 * 60 * 60));
    var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    var msgEl = document.getElementById(elementId + "-msg");
    var timerEl = document.getElementById(elementId + "-timer-text");

    if (msgEl) {
      var rawMsg = isBeforeCutoff ? textBeforeCutoff : textAfterCutoff;
      var diaReplacement = isBeforeCutoff ? "HOY" : "mañana";
      msgEl.innerHTML = rawMsg.replace(/\{\{dia\}\}/g, '<span style="background:rgba(255,255,255,0.3);padding:2px 6px;border-radius:4px;font-weight:900;">' + diaReplacement + '</span>');
    }

    if (timerEl) {
      timerEl.textContent = h + "h " + (m < 10 ? "0" : "") + m + "m";
    }
  }

  updateDespachoInfo();
  setInterval(updateDespachoInfo, 10000);

  // Telemetría Nevux
  if (typeof nvxTrack === "function") {
    nvxTrack(w.id, "impression");
  }
    }
/* ═══════════════════════════════════════════
   WIDGET: URGENCIA DE STOCK
   ═══════════════════════════════════════════ */
function renderUrgenciaStock(w) {
  var elementId = "nvx-stock-" + w.id;
  if (document.getElementById(elementId)) return;

  var cfg = w.config || {};
  var location = cfg.location || "product_before";

  // Verificación estricta: SOLO en Ficha de Producto
  var currentPage = typeof detectPageType === "function" ? detectPageType() : "";
  if (currentPage !== "product") {
    return;
  }

  var thresholdHigh = parseInt(cfg.thresholdHigh, 10) || 10;
  var thresholdLow = parseInt(cfg.thresholdLow, 10) || 3;
  var textMedium = cfg.textMedium || "Quedan pocas unidades: {stock} disponibles";
  var textHigh = cfg.textHigh || "¡Últimas {stock} unidades!";
  var bgColor = cfg.bgColor || "#fef3c7";
  var textColor = cfg.textColor || "#92400e";
  var borderColor = cfg.borderColor || "#fcd34d";
  var fontSize = cfg.fontSize || "14px";
  var icon = cfg.icon || "⚠️";

  // Presets de campaña
  var THEMES = {
    "black-friday": { bg: "#111827", text: "#F59E0B", border: "#F59E0B" },
    "hot-sale": { bg: "#0F172A", text: "#ffffff", border: "#EF4444" },
    "cyber-monday": { bg: "#090D16", text: "#ffffff", border: "#3B82F6" },
    "navidad": { bg: "#064E3B", text: "#ffffff", border: "#EF4444" },
    "san-valentin": { bg: "#831843", text: "#ffffff", border: "#F43F5E" },
    "dia-padre-madre": { bg: "#312E81", text: "#ffffff", border: "#10B981" },
    "liquidacion": { bg: "#7F1D1D", text: "#FBBF24", border: "#FBBF24" }
  };

  if (cfg.campaignTheme && cfg.campaignTheme !== "none" && THEMES[cfg.campaignTheme]) {
    var t = THEMES[cfg.campaignTheme];
    bgColor = t.bg;
    textColor = t.text;
    borderColor = t.border;
  }

  // Obtener stock real del producto en Tiendanube
  var currentStock = null;
  try {
    if (window.LS && window.LS.product) {
      var p = window.LS.product;
      if (p.variants && p.variants.length > 0) {
        for (var v = 0; v < p.variants.length; v++) {
          if (p.variants[v].stock !== undefined && p.variants[v].stock !== null) {
            currentStock = parseInt(p.variants[v].stock, 10);
            break;
          }
        }
      }
      if (currentStock === null && p.stock !== undefined && p.stock !== null) {
        currentStock = parseInt(p.stock, 10);
      }
    }
  } catch(e) {}

  // Fallback seguro si la tienda no gestiona unidades exactas por JS
  if (currentStock === null || isNaN(currentStock)) {
    currentStock = thresholdLow;
  }

  // Si el stock supera el umbral alto, el aviso no se muestra
  if (currentStock > thresholdHigh) {
    return;
  }

  // Selección de texto según nivel de urgencia
  var isHighUrgency = currentStock <= thresholdLow;
  var rawText = isHighUrgency ? textHigh : textMedium;
  var finalText = rawText.replace(/\{stock\}/g, currentStock.toString());
  var safeText = typeof escapeHtml === "function" ? escapeHtml(finalText) : finalText;

  // Inyección de estilos específicos indetectables por el tema
  var styleId = "style-" + elementId;
  if (!document.getElementById(styleId)) {
    var borderCss = (borderColor && borderColor !== "transparent") ? "1.5px solid " + borderColor : "none";
    var styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.type = "text/css";
    var css =
      "#" + elementId + " { " +
        "background: " + bgColor + " !important; " +
        "border: " + borderCss + " !important; " +
        "border-radius: 12px !important; " +
        "padding: 12px 16px !important; " +
        "color: " + textColor + " !important; " +
        "font-size: " + fontSize + " !important; " +
        "font-weight: 800 !important; " +
        "box-sizing: border-box !important; " +
        "box-shadow: 0 4px 14px rgba(0,0,0,0.06) !important; " +
        "display: flex !important; " +
        "align-items: center !important; " +
        "justify-content: center !important; " +
        "gap: 8px !important; " +
        "margin: 12px 0 !important; " +
        "width: 100% !important; " +
        "max-width: 100% !important; " +
        "flex-basis: 100% !important; " +
        "clear: both !important; " +
        "text-align: center !important; " +
        "font-family: system-ui, -apple-system, sans-serif !important; " +
      "}";
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);
  }

  var container = document.createElement("div");
  container.id = elementId;
  container.className = "nvx-widget nvx-stock-wrapper";

  var safeIcon = typeof escapeHtml === "function" ? escapeHtml(icon) : icon;
  var iconHtml = (icon && icon !== "none") ? '<span style="font-size:18px;flex-shrink:0;">' + safeIcon + '</span>' : '';
  container.innerHTML = iconHtml + '<span>' + safeText + '</span>';

  // Ubicación precisa sin colisiones
  var targetEl = null;

  if (location === "price_before") {
    // ARRIBA DEL PRECIO: Justo debajo del título del producto o SKU
    var titleSelectors = [
      "h1.js-product-name",
      "h1.product-title",
      "h1.page-header",
      ".js-product-name",
      "h1"
    ];
    for (var tIdx = 0; tIdx < titleSelectors.length; tIdx++) {
      var tEl = document.querySelector(titleSelectors[tIdx]);
      if (tEl) {
        targetEl = tEl;
        break;
      }
    }
    if (targetEl && targetEl.parentNode) {
      var skuEl = targetEl.parentNode.querySelector(".js-product-sku, .product-sku, .sku-container");
      if (skuEl && skuEl.parentNode === targetEl.parentNode) {
        skuEl.parentNode.insertBefore(container, skuEl.nextSibling);
      } else {
        targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
      }
    }
  } else if (location === "price_after") {
    // ABAJO DEL PRECIO: Debajo de todo el bloque de precio y descuento
    var priceSelectors = [
      ".js-price-container",
      ".price-container",
      ".product-price-container",
      ".js-product-price-container",
      "#price_display",
      ".js-price-display",
      ".product-price"
    ];
    for (var pIdx = 0; pIdx < priceSelectors.length; pIdx++) {
      var pEl = document.querySelector(priceSelectors[pIdx]);
      if (pEl) {
        var parent = pEl.parentNode;
        if (parent && (parent.classList.contains("price-container") || parent.classList.contains("js-price-container") || parent.classList.contains("product-price-container"))) {
          targetEl = parent;
        } else {
          targetEl = pEl;
        }
        break;
      }
    }
    if (targetEl && targetEl.parentNode) {
      try {
        if (window.getComputedStyle(targetEl.parentNode).display.indexOf("flex") !== -1) {
          targetEl.parentNode.style.flexWrap = "wrap";
        }
      } catch(e) {}
      targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
    }
  }

  // Fallback si no fue price_before / price_after o no encontró selector de precio
  if (!container.parentNode) {
    var buySelectors = [
      "form[action*='/cart/add']",
      "form.js-product-form",
      ".js-product-buy-container",
      ".product-buy-container",
      "form.js-product-buyform",
      ".js-add-to-cart-btn",
      "#product_form"
    ];
    for (var bIdx = 0; bIdx < buySelectors.length; bIdx++) {
      var bEl = document.querySelector(buySelectors[bIdx]);
      if (bEl) {
        targetEl = bEl;
        break;
      }
    }
    if (targetEl && targetEl.parentNode) {
      if (location === "product_after") {
        targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
      } else {
        targetEl.parentNode.insertBefore(container, targetEl);
      }
    } else {
      var main = document.querySelector("main, #content, .main-content, .js-product-container");
      if (main) main.insertBefore(container, main.firstChild);
    }
  }

  // Telemetría Nevux
  if (typeof nvxTrack === "function") {
    nvxTrack(w.id, "impression");
  }
}
  /* ═══════════════════════════════════════════
   WIDGET: RESEÑAS DESTACADAS
   ═══════════════════════════════════════════ */
function renderResenasDestacadas(w) {
  var elementId = "nvx-reviews-" + w.id;
  if (document.getElementById(elementId)) return;

  var cfg = w.config || {};
  var location = cfg.location || "product_after";

  // Verificación estricta: SOLO en Ficha de Producto
  var currentPage = typeof detectPageType === "function" ? detectPageType() : "";
  if (currentPage !== "product") {
    return;
  }

  var averageRating = cfg.averageRating || 4.8;
  var totalReviews = cfg.totalReviews || 36;
  var showVerifiedBadge = cfg.showVerifiedBadge !== false;
  var layout = cfg.layout || "list";
  var bgColor = cfg.bgColor || "#ffffff";
  var textColor = cfg.textColor || "#111827";
  var cardBgColor = cfg.cardBgColor || "#f9fafb";
  var accentColor = cfg.accentColor || "#10B981";
  var reviews = cfg.reviews && cfg.reviews.length > 0 ? cfg.reviews : [
    { id: "1", name: "Luna R.", initials: "LR", rating: 5, text: "Muy buena calidad. El material es excelente y se nota que está bien hecho.", verified: true },
    { id: "2", name: "Mica P.", initials: "MP", rating: 5, text: "Llegó rapidísimo, mejor de lo esperado. Todo perfecto.", verified: true },
    { id: "3", name: "Nora S.", initials: "NS", rating: 5, text: "Se ve tal cual en las fotos, muy lindo y práctico.", verified: true }
  ];

  // Presets de campaña
  var THEMES = {
    "black-friday": { bg: "#111827", text: "#ffffff", card: "#1f2937", accent: "#F59E0B" },
    "hot-sale": { bg: "#0F172A", text: "#ffffff", card: "#1e293b", accent: "#EF4444" },
    "cyber-monday": { bg: "#090D16", text: "#ffffff", card: "#111827", accent: "#3B82F6" },
    "navidad": { bg: "#064E3B", text: "#ffffff", card: "#047857", accent: "#EF4444" },
    "san-valentin": { bg: "#831843", text: "#ffffff", card: "#9d174d", accent: "#F43F5E" },
    "dia-padre-madre": { bg: "#312E81", text: "#ffffff", card: "#3730a3", accent: "#10B981" },
    "liquidacion": { bg: "#7F1D1D", text: "#ffffff", card: "#991b1b", accent: "#FBBF24" }
  };

  if (cfg.campaignTheme && cfg.campaignTheme !== "none" && THEMES[cfg.campaignTheme]) {
    var t = THEMES[cfg.campaignTheme];
    bgColor = t.bg;
    textColor = t.text;
    cardBgColor = t.card;
    accentColor = t.accent;
  }

  // Inyección de estilos específicos
  var styleId = "style-" + elementId;
  if (!document.getElementById(styleId)) {
    var styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.type = "text/css";
    var css =
      "#" + elementId + " { " +
        "background: " + bgColor + " !important; " +
        "border: 1px solid #e5e7eb !important; " +
        "border-radius: 16px !important; " +
        "padding: 16px !important; " +
        "color: " + textColor + " !important; " +
        "box-sizing: border-box !important; " +
        "box-shadow: 0 4px 14px rgba(0,0,0,0.05) !important; " +
        "display: flex !important; " +
        "flex-direction: column !important; " +
        "gap: 12px !important; " +
        "margin: 14px 0 !important; " +
        "width: 100% !important; " +
        "font-family: system-ui, -apple-system, sans-serif !important; " +
      "} " +
      "#" + elementId + " .nvx-review-card { " +
        "background: " + cardBgColor + " !important; " +
        "border-radius: 12px !important; " +
        "padding: 12px !important; " +
        "border: 1px solid rgba(0,0,0,0.06) !important; " +
        "display: flex !important; " +
        "flex-direction: column !important; " +
        "gap: 6px !important; " +
      "} " +
      "#" + elementId + " .nvx-avatar { " +
        "background: " + accentColor + " !important; " +
        "color: #ffffff !important; " +
        "width: 32px !important; " + // Un poquito más grande para lucir mejor las fotos (32px)
        "height: 32px !important; " +
        "border-radius: 50% !important; " +
        "font-size: 11px !important; " +
        "font-weight: 900 !important; " +
        "display: flex !important; " +
        "align-items: center !important; " +
        "justify-content: center !important; " +
        "flex-shrink: 0 !important; " +
        "overflow: hidden !important; " + // Crítico para que la imagen se recorte redonda
      "} " +
      "#" + elementId + " .nvx-avatar-img { " +
        "width: 100% !important; " +
        "height: 100% !important; " +
        "object-fit: cover !important; " + // Centrado y recorte perfecto
        "display: block !important; " +
      "}";
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);
  }

  var container = document.createElement("div");
  container.id = elementId;
  container.className = "nvx-widget nvx-reviews-wrapper";

  // HTML del Header
  var verifiedHtml = showVerifiedBadge ?
    '<span style="background:#ecfdf5 !important;color:#059669 !important;border:1px solid #a7f3d0 !important;border-radius:999px !important;padding:2px 8px !important;font-size:11px !important;font-weight:800 !important;white-space:nowrap !important;">✓ Verificadas</span>' : '';

  var headerHtml =
    '<div style="display:flex !important;align-items:center !important;justify-content:space-between !important;width:100% !important;' + (layout === "compact" ? "" : "border-bottom:1px solid rgba(0,0,0,0.08) !important;padding-bottom:10px !important;") + '">' +
      '<div style="display:flex !important;align-items:center !important;gap:8px !important;">' +
        '<span style="font-size:16px !important;white-space:nowrap !important;">⭐⭐⭐⭐⭐</span>' +
        '<span style="font-size:15px !important;font-weight:900 !important;color:' + textColor + ' !important;">' + averageRating + '</span>' +
        '<span style="font-size:12px !important;opacity:0.6 !important;color:' + textColor + ' !important;">(' + totalReviews + ' reseñas)</span>' +
      '</div>' +
      verifiedHtml +
    '</div>';

  // HTML de las Cards (si no es compact)
  var cardsHtml = "";
  if (layout !== "compact") {
    var isCarousel = layout === "carousel";
    cardsHtml = '<div style="display:flex !important;flex-direction:' + (isCarousel ? "row" : "column") + ' !important;gap:10px !important;width:100% !important;' + (isCarousel ? "overflow-x:auto !important;padding-bottom:6px !important;" : "") + '">';

    for (var i = 0; i < reviews.length; i++) {
      var r = reviews[i];
      var stars = "";
      for (var s = 0; s < (r.rating || 5); s++) {
        stars += "⭐";
      }

      var verHtml = r.verified ? '<span style="font-size:10px !important;font-weight:700 !important;color:#10B981 !important;display:inline-flex !important;align-items:center !important;gap:3px !important;margin-top:2px !important;">✓ Compra verificada</span>' : '';

      // Decisión del contenido del avatar (Foto o Iniciales)
      var avatarContent = "";
      if (r.photo) {
        avatarContent = '<img class="nvx-avatar-img" src="' + r.photo + '" alt="' + (r.name || "") + '" />';
      } else {
        avatarContent = r.initials || "U";
      }

      cardsHtml +=
        '<div class="nvx-review-card" style="' + (isCarousel ? "min-width:220px !important;max-width:220px !important;flex-shrink:0 !important;" : "width:100% !important;") + 'box-sizing:border-box !important;">' +
          '<div style="display:flex !important;align-items:center !important;justify-content:space-between !important;width:100% !important;gap:6px !important;">' +
            '<div style="display:flex !important;align-items:center !important;gap:8px !important;min-width:0 !important;flex:1 !important;">' +
              '<div class="nvx-avatar">' + avatarContent + '</div>' +
              '<span style="font-size:13px !important;font-weight:800 !important;color:' + textColor + ' !important;white-space:nowrap !important;overflow:hidden !important;text-overflow:ellipsis !important;display:block !important;flex:1 !important;">' + (typeof escapeHtml === "function" ? escapeHtml(r.name) : r.name) + '</span>' +
            '</div>' +
            '<span style="font-size:11px !important;white-space:nowrap !important;">' + stars + '</span>' +
          '</div>' +
          '<p style="font-size:12px !important;color:' + textColor + ' !important;opacity:0.85 !important;margin:0 !important;line-height:1.4 !important;word-break:break-word !important;">' + (typeof escapeHtml === "function" ? escapeHtml(r.text) : r.text) + '</p>' +
          verHtml +
        '</div>';
    }
    cardsHtml += '</div>';
  }

  container.innerHTML = headerHtml + cardsHtml;

  // Inserción en la página
  var targetEl = null;

  if (location === "title_after") {
    var titleSelectors = ["h1.js-product-name", "h1.product-title", "h1.page-header", ".js-product-name", "h1"];
    for (var tIdx = 0; tIdx < titleSelectors.length; tIdx++) {
      var tEl = document.querySelector(titleSelectors[tIdx]);
      if (tEl) { targetEl = tEl; break; }
    }
    if (targetEl && targetEl.parentNode) {
      targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
    }
  } else if (location === "price_after") {
    var priceSelectors = [".js-price-container", ".price-container", ".product-price-container", ".js-product-price-container", "#price_display", ".js-price-display", ".product-price"];
    for (var pIdx = 0; pIdx < priceSelectors.length; pIdx++) {
      var pEl = document.querySelector(priceSelectors[pIdx]);
      if (pEl) {
        var parent = pEl.parentNode;
        if (parent && (parent.classList.contains("price-container") || parent.classList.contains("js-price-container") || parent.classList.contains("product-price-container"))) {
          targetEl = parent;
        } else {
          targetEl = pEl;
        }
        break;
      }
    }
    if (targetEl && targetEl.parentNode) {
      targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
    }
  }

  if (!container.parentNode) {
    var buySelectors = [
      "form[action*='/cart/add']",
      "form.js-product-form",
      ".js-product-buy-container",
      ".product-buy-container",
      "form.js-product-buyform",
      ".js-add-to-cart-btn",
      "#product_form"
    ];
    for (var bIdx = 0; bIdx < buySelectors.length; bIdx++) {
      var bEl = document.querySelector(buySelectors[bIdx]);
      if (bEl) { targetEl = bEl; break; }
    }
    if (targetEl && targetEl.parentNode) {
      if (location === "product_before") {
        targetEl.parentNode.insertBefore(container, targetEl);
      } else {
        targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
      }
    } else {
      var main = document.querySelector("main, #content, .main-content, .js-product-container");
      if (main) main.insertBefore(container, main.firstChild);
    }
  }

  // Telemetría Nevux
  if (typeof nvxTrack === "function") {
    nvxTrack(w.id, "impression");
  }
}
/* ═══════════════════════════════════════════
   WIDGET: BUNDLE DE PROMOCIONES (v229)
   Sin producto complementario
   ═══════════════════════════════════════════ */
if (typeof window.nvxBundleParsePrice !== "function") {
  window.nvxBundleParsePrice = function (raw) {
    if (!raw) return 0;
    var str = String(raw).trim();
    str = str.replace(/[^0-9.,]/g, "");
    if (!str) return 0;

    if (str.indexOf(",") > -1 && str.indexOf(".") > -1) {
      if (str.lastIndexOf(",") > str.lastIndexOf(".")) {
        str = str.replace(/\./g, "").replace(",", ".");
      } else {
        str = str.replace(/,/g, "");
      }
    } else if (str.indexOf(",") > -1) {
      var partsCom = str.split(",");
      if (partsCom.length === 2 && partsCom[1].length === 2) {
        str = partsCom[0].replace(/\./g, "") + "." + partsCom[1];
      } else {
        str = str.replace(/,/g, "");
      }
    } else if (str.indexOf(".") > -1) {
      var partsDot = str.split(".");
      if (!(partsDot.length === 2 && partsDot[1].length === 2)) {
        str = str.replace(/\./g, "");
      }
    }

    var val = parseFloat(str);
    return isNaN(val) ? 0 : val;
  };
}

if (typeof window.nvxBundleFormatPrice !== "function") {
  window.nvxBundleFormatPrice = function (num) {
    var n = Math.round(Number(num) || 0);
    var str = String(n);
    var out = "";
    var c = 0;
    for (var i = str.length - 1; i >= 0; i--) {
      out = str.charAt(i) + out;
      c++;
      if (c === 3 && i > 0) {
        out = "." + out;
        c = 0;
      }
    }
    return "$" + out;
  };
}

if (typeof window.nvxBundleGetProductPrice !== "function") {
  window.nvxBundleGetProductPrice = function () {
    var textSels = [
      ".js-price-display",
      "#price_display",
      ".js-product-price",
      ".product-price",
      ".price-display",
      ".js-compare-price-display",
      ".product-price-container .js-price-display"
    ];
    for (var i = 0; i < textSels.length; i++) {
      var el = document.querySelector(textSels[i]);
      if (!el) continue;
      var txt = el.innerText || el.textContent || "";
      var val = window.nvxBundleParsePrice(txt);
      if (val > 0) return val;
    }

    var attrSels = [
      "meta[itemprop='price']",
      "[itemprop='price']",
      "[data-product-price]"
    ];
    for (var j = 0; j < attrSels.length; j++) {
      var aEl = document.querySelector(attrSels[j]);
      if (!aEl) continue;
      var rawAttr = aEl.getAttribute("content") || aEl.getAttribute("data-product-price") || aEl.getAttribute("data-price") || "";
      var aVal = window.nvxBundleParsePrice(rawAttr);
      if (aVal > 0) {
        if (aVal > 500000 && aVal % 100 === 0) {
          aVal = aVal / 100;
        }
        return aVal;
      }
    }
    return 0;
  };
}

if (typeof window.nvxBundleParseDeal !== "function") {
  window.nvxBundleParseDeal = function (title) {
    var t = String(title || "").toLowerCase();
    var m = t.match(/lleva\s*(\d+)\s*paga\s*(\d+)/);
    if (m) {
      return { take: parseInt(m[1], 10) || 1, pay: parseInt(m[2], 10) || 1 };
    }
    var m2 = t.match(/(\d+)\s*[x×]\s*(\d+)/);
    if (m2) {
      var a = parseInt(m2[1], 10) || 1;
      var b = parseInt(m2[2], 10) || 1;
      if (a >= b) return { take: a, pay: b };
      return { take: b, pay: a };
    }
    var m3 = t.match(/(\d+)/);
    if (m3) {
      var q = parseInt(m3[1], 10) || 1;
      return { take: q, pay: q };
    }
    return { take: 1, pay: 1 };
  };
}

if (typeof window.nvxSelectBundle !== "function") {
  window.nvxSelectBundle = function (cardEl, qty, elementId) {
    var parent = cardEl.parentNode;
    if (!parent) return;
    var cards = parent.getElementsByClassName("nvx-bundle-card");
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.remove("selected");
    }
    cardEl.classList.add("selected");

    var qtyInputs = document.querySelectorAll('input.js-quantity-input, input[name="quantity"], input.quantity-input, #quantity, .js-prod-quantity');
    for (var j = 0; j < qtyInputs.length; j++) {
      qtyInputs[j].value = qty;
      try {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", true, true);
        qtyInputs[j].dispatchEvent(evt);
      } catch (e) {}
    }

    if (typeof window.nvxBundleUpdateTotal === "function") {
      window.nvxBundleUpdateTotal(elementId);
    }
  };
}

if (typeof window.nvxBundleUpdateTotal !== "function") {
  window.nvxBundleUpdateTotal = function (elementId) {
    var root = document.getElementById(elementId);
    if (!root) return;

    var selected = root.querySelector(".nvx-bundle-card.selected");
    var packPrice = 0;
    if (selected) {
      packPrice = parseFloat(selected.getAttribute("data-new-price") || "0") || 0;
    }

    var totalEl = root.querySelector(".nvx-bundle-total");
    var btn = root.querySelector(".nvx-bundle-btn");
    var baseBtn = root.getAttribute("data-btn-text") || "Sumalo al carrito";

    if (totalEl) {
      totalEl.innerHTML = "Total del pack: <strong>" + window.nvxBundleFormatPrice(packPrice) + "</strong>";
    }
    if (btn) {
      btn.innerHTML = baseBtn + " · " + window.nvxBundleFormatPrice(packPrice);
    }
  };
}

if (typeof window.nvxSubmitBundle !== "function") {
  window.nvxSubmitBundle = function (btnEl) {
    var orig = btnEl.innerHTML;
    btnEl.innerHTML = "¡Agregando al carrito...!";
    setTimeout(function () {
      btnEl.innerHTML = orig;
    }, 2000);

    var root = btnEl.parentNode;
    var selected = root ? root.querySelector(".nvx-bundle-card.selected") : null;
    if (selected) {
      var qty = parseInt(selected.getAttribute("data-qty") || "1", 10) || 1;
      var qtyInputs = document.querySelectorAll('input.js-quantity-input, input[name="quantity"], input.quantity-input, #quantity, .js-prod-quantity');
      for (var j = 0; j < qtyInputs.length; j++) {
        qtyInputs[j].value = qty;
        try {
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent("change", true, true);
          qtyInputs[j].dispatchEvent(evt);
        } catch (e) {}
      }
    }

    var targetBtn = document.querySelector('form[action*="/cart/add"] [type="submit"], .js-add-to-cart-btn, .js-prod-submit-form, input.js-addtocart, #product_form [type="submit"]');
    if (targetBtn) {
      targetBtn.click();
    } else {
      var form = document.querySelector('form[action*="/cart/add"]');
      if (form) form.submit();
    }
  };
}

function renderBundlePromociones(w) {
  var elementId = "nvx-bundle-" + w.id;
  if (document.getElementById(elementId)) return;

  var cfg = w.config || {};
  var location = cfg.location || "product_after";

  var currentPage = typeof detectPageType === "function" ? detectPageType() : "";
  if (currentPage !== "product") {
    return;
  }

  var title = cfg.title || "Elegí tu pack en promo";
  var subtitle = cfg.subtitle || "";
  var bgColor = cfg.bgColor || "#ffffff";
  var textColor = cfg.textColor || "#111827";
  var cardBgColor = cfg.cardBgColor || "#f9fafb";
  var accentColor = cfg.accentColor || "#10B981";
  var buttonBgColor = cfg.buttonBgColor || "#10B981";
  var buttonTextColor = cfg.buttonTextColor || "#ffffff";
  var buttonText = cfg.buttonText || "Sumalo al carrito";

  var bundles = cfg.bundles || [
    { id: "1", title: "Lleva 2 paga 1", badge: "-50% OFF", oldPrice: "", newPrice: "", enabled: true },
    { id: "2", title: "Lleva 3 paga 2", badge: "-33% OFF", oldPrice: "", newPrice: "", enabled: true }
  ];

  var THEMES = {
    "black-friday": { bg: "#111827", text: "#ffffff", card: "#1f2937", accent: "#F59E0B", btn: "#F59E0B" },
    "hot-sale": { bg: "#0F172A", text: "#ffffff", card: "#1e293b", accent: "#EF4444", btn: "#EF4444" },
    "cyber-monday": { bg: "#090D16", text: "#ffffff", card: "#111827", accent: "#3B82F6", btn: "#3B82F6" },
    "navidad": { bg: "#064E3B", text: "#ffffff", card: "#047857", accent: "#EF4444", btn: "#EF4444" },
    "san-valentin": { bg: "#831843", text: "#ffffff", card: "#9d174d", accent: "#F43F5E", btn: "#F43F5E" },
    "dia-padre-madre": { bg: "#312E81", text: "#ffffff", card: "#3730a3", accent: "#10B981", btn: "#10B981" },
    "liquidacion": { bg: "#7F1D1D", text: "#ffffff", card: "#991b1b", accent: "#FBBF24", btn: "#FBBF24" }
  };

  if (cfg.campaignTheme && cfg.campaignTheme !== "none" && THEMES[cfg.campaignTheme]) {
    var th = THEMES[cfg.campaignTheme];
    bgColor = th.bg;
    textColor = th.text;
    cardBgColor = th.card;
    accentColor = th.accent;
    buttonBgColor = th.btn;
  }

  var unitPrice = window.nvxBundleGetProductPrice();

  var activeBundles = [];
  for (var bIdx = 0; bIdx < bundles.length; bIdx++) {
    if (bundles[bIdx] && (bundles[bIdx].enabled === true || bundles[bIdx].enabled === undefined)) {
      activeBundles.push(bundles[bIdx]);
    }
  }
  if (activeBundles.length === 0) return;

  for (var c = 0; c < activeBundles.length; c++) {
    var deal = window.nvxBundleParseDeal(activeBundles[c].title);
    activeBundles[c]._take = deal.take;
    activeBundles[c]._pay = deal.pay;
    if (unitPrice > 0) {
      var oldP = unitPrice * deal.take;
      var newP = unitPrice * deal.pay;
      activeBundles[c]._oldNum = oldP;
      activeBundles[c]._newNum = newP;
      activeBundles[c]._oldStr = window.nvxBundleFormatPrice(oldP);
      activeBundles[c]._newStr = window.nvxBundleFormatPrice(newP);
      if (oldP > 0 && newP < oldP) {
        var pct = Math.round((1 - (newP / oldP)) * 100);
        activeBundles[c]._badge = "-" + pct + "% OFF";
      } else {
        activeBundles[c]._badge = activeBundles[c].badge || "";
      }
    } else {
      activeBundles[c]._oldNum = window.nvxBundleParsePrice(activeBundles[c].oldPrice);
      activeBundles[c]._newNum = window.nvxBundleParsePrice(activeBundles[c].newPrice);
      activeBundles[c]._oldStr = activeBundles[c].oldPrice || "";
      activeBundles[c]._newStr = activeBundles[c].newPrice || "";
      activeBundles[c]._badge = activeBundles[c].badge || "";
    }
  }

  var styleId = "style-" + elementId;
  if (!document.getElementById(styleId)) {
    var styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.type = "text/css";
    var css =
      "#" + elementId + " { " +
        "background: " + bgColor + " !important; " +
        "border: 1px solid #e5e7eb !important; " +
        "border-radius: 16px !important; " +
        "padding: 16px !important; " +
        "color: " + textColor + " !important; " +
        "box-sizing: border-box !important; " +
        "box-shadow: 0 4px 14px rgba(0,0,0,0.05) !important; " +
        "display: flex !important; " +
        "flex-direction: column !important; " +
        "gap: 12px !important; " +
        "margin: 14px 0 !important; " +
        "width: 100% !important; " +
        "font-family: system-ui, -apple-system, sans-serif !important; " +
      "} " +
      "#" + elementId + " .nvx-bundle-card { " +
        "background: " + cardBgColor + " !important; " +
        "border-radius: 12px !important; " +
        "padding: 12px !important; " +
        "border: 1.5px solid rgba(0,0,0,0.08) !important; " +
        "display: flex !important; " +
        "align-items: center !important; " +
        "justify-content: space-between !important; " +
        "cursor: pointer !important; " +
        "transition: all 0.2s !important; " +
        "user-select: none !important; " +
      "} " +
      "#" + elementId + " .nvx-bundle-card:hover { border-color: " + accentColor + " !important; } " +
      "#" + elementId + " .nvx-bundle-card.selected { " +
        "background: #ffffff !important; " +
        "border-color: " + accentColor + " !important; " +
        "box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important; " +
      "} " +
      "#" + elementId + " .nvx-radio { " +
        "width: 18px !important; height: 18px !important; border-radius: 50% !important; " +
        "border: 2px solid #d1d5db !important; display: flex !important; " +
        "align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; " +
      "} " +
      "#" + elementId + " .nvx-bundle-card.selected .nvx-radio { border-color: " + accentColor + " !important; } " +
      "#" + elementId + " .nvx-radio-dot { " +
        "width: 10px !important; height: 10px !important; border-radius: 50% !important; " +
        "background: " + accentColor + " !important; display: none !important; " +
      "} " +
      "#" + elementId + " .nvx-bundle-card.selected .nvx-radio-dot { display: block !important; } " +
      "#" + elementId + " .nvx-bundle-total { " +
        "font-size: 13px !important; font-weight: 700 !important; color: " + textColor + " !important; " +
        "text-align: right !important; width: 100% !important; " +
      "} " +
      "#" + elementId + " .nvx-bundle-total strong { color: " + accentColor + " !important; font-weight: 900 !important; } " +
      "#" + elementId + " .nvx-bundle-note { " +
        "font-size: 11px !important; opacity: 0.65 !important; color: " + textColor + " !important; " +
        "line-height: 1.35 !important; " +
      "} " +
      "#" + elementId + " .nvx-bundle-btn { " +
        "width: 100% !important; background: " + buttonBgColor + " !important; color: " + buttonTextColor + " !important; " +
        "border: none !important; border-radius: 12px !important; padding: 14px !important; " +
        "font-size: 15px !important; font-weight: 800 !important; cursor: pointer !important; " +
        "margin-top: 4px !important; box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important; " +
      "} " +
      "#" + elementId + " .nvx-bundle-btn:active { transform: scale(0.98) !important; }";
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);
  }

  var container = document.createElement("div");
  container.id = elementId;
  container.className = "nvx-widget nvx-bundle-wrapper";
  container.setAttribute("data-btn-text", buttonText);

  var subtitleHtml = subtitle
    ? '<div style="font-size:12px !important;opacity:0.7 !important;margin-top:2px !important;color:' + textColor + ' !important;">' + (typeof escapeHtml === "function" ? escapeHtml(subtitle) : subtitle) + "</div>"
    : "";

  var headerHtml =
    '<div style="width:100% !important;">' +
      '<div style="font-size:16px !important;font-weight:800 !important;color:' + textColor + ' !important;">' + (typeof escapeHtml === "function" ? escapeHtml(title) : title) + "</div>" +
      subtitleHtml +
    "</div>";

  var bundlesHtml = '<div style="display:flex !important;flex-direction:column !important;gap:10px !important;width:100% !important;">';
  for (var k = 0; k < activeBundles.length; k++) {
    var b = activeBundles[k];
    var isSelected = k === 0;
    var qtyNum = b._take || 1;
    var badgeTxt = b._badge || "";
    var badgeHtml = badgeTxt
      ? '<span style="background:#fef2f2 !important;color:#ef4444 !important;border-radius:6px !important;padding:2px 6px !important;font-size:10px !important;font-weight:800 !important;">' + (typeof escapeHtml === "function" ? escapeHtml(badgeTxt) : badgeTxt) + "</span>"
      : "";

    bundlesHtml +=
      '<div class="nvx-bundle-card ' + (isSelected ? "selected" : "") + '" data-qty="' + qtyNum + '" data-new-price="' + (b._newNum || 0) + '" onclick="window.nvxSelectBundle(this, ' + qtyNum + ', \'' + elementId + '\');">' +
        '<div style="display:flex !important;align-items:center !important;gap:10px !important;">' +
          '<div class="nvx-radio"><div class="nvx-radio-dot"></div></div>' +
          '<div>' +
            '<div style="font-size:14px !important;font-weight:800 !important;color:' + textColor + ' !important;display:flex !important;align-items:center !important;gap:6px !important;flex-wrap:wrap !important;">' +
              (typeof escapeHtml === "function" ? escapeHtml(b.title) : b.title) + badgeHtml +
            "</div>" +
          "</div>" +
        "</div>" +
        '<div style="text-align:right !important;">' +
          '<div style="font-size:11px !important;text-decoration:line-through !important;opacity:0.5 !important;color:' + textColor + ' !important;">' + (b._oldStr || "") + "</div>" +
          '<div style="font-size:14px !important;font-weight:900 !important;color:' + accentColor + ' !important;">' + (b._newStr || "") + "</div>" +
        "</div>" +
      "</div>";
  }
  bundlesHtml += "</div>";

  var firstNew = activeBundles[0] ? (activeBundles[0]._newNum || 0) : 0;

  var totalHtml =
    '<div class="nvx-bundle-total">Total del pack: <strong>' + window.nvxBundleFormatPrice(firstNew) + "</strong></div>" +
    '<div class="nvx-bundle-note">El pack agrega la cantidad al carrito. El descuento real se aplica con las reglas de promoción de Tiendanube.</div>';

  var buttonHtml =
    '<button type="button" class="nvx-bundle-btn" onclick="window.nvxSubmitBundle(this);">' +
      (typeof escapeHtml === "function" ? escapeHtml(buttonText) : buttonText) + " · " + window.nvxBundleFormatPrice(firstNew) +
    "</button>";

  container.innerHTML = headerHtml + bundlesHtml + totalHtml + buttonHtml;

  var targetEl = null;

  if (location === "title_after") {
    var titleSelectors = ["h1.js-product-name", "h1.product-title", "h1.page-header", ".js-product-name", "h1"];
    for (var tIdx = 0; tIdx < titleSelectors.length; tIdx++) {
      var tEl = document.querySelector(titleSelectors[tIdx]);
      if (tEl) { targetEl = tEl; break; }
    }
    if (targetEl && targetEl.parentNode) {
      targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
    }
  } else if (location === "price_after") {
    var priceSelectors = [".js-price-container", ".price-container", ".product-price-container", ".js-product-price-container", "#price_display", ".js-price-display", ".product-price"];
    for (var pIdx = 0; pIdx < priceSelectors.length; pIdx++) {
      var pEl = document.querySelector(priceSelectors[pIdx]);
      if (pEl) {
        var parent = pEl.parentNode;
        if (parent && (parent.classList.contains("price-container") || parent.classList.contains("js-price-container") || parent.classList.contains("product-price-container"))) {
          targetEl = parent;
        } else {
          targetEl = pEl;
        }
        break;
      }
    }
    if (targetEl && targetEl.parentNode) {
      targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
    }
  }

  if (!container.parentNode) {
    var buySelectors = [
      "form[action*='/cart/add']",
      "form.js-product-form",
      ".js-product-buy-container",
      ".product-buy-container",
      "form.js-product-buyform",
      ".js-add-to-cart-btn",
      "#product_form"
    ];
    for (var sIdx = 0; sIdx < buySelectors.length; sIdx++) {
      var bEl = document.querySelector(buySelectors[sIdx]);
      if (bEl) { targetEl = bEl; break; }
    }
    if (targetEl && targetEl.parentNode) {
      if (location === "product_before") {
        targetEl.parentNode.insertBefore(container, targetEl);
      } else {
        targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
      }
    } else {
      var main = document.querySelector("main, #content, .main-content, .js-product-container");
      if (main) main.insertBefore(container, main.firstChild);
    }
  }

  if (activeBundles.length > 0) {
    var initQty = activeBundles[0]._take || 1;
    var qtyInputs = document.querySelectorAll('input.js-quantity-input, input[name="quantity"], input.quantity-input, #quantity, .js-prod-quantity');
    for (var qI = 0; qI < qtyInputs.length; qI++) {
      qtyInputs[qI].value = initQty;
    }
  }

  if (typeof window.nvxBundleUpdateTotal === "function") {
    window.nvxBundleUpdateTotal(elementId);
  }

  if (typeof nvxTrack === "function") {
    nvxTrack(w.id, "impression");
  }
        }
  /* ═══════════════════════════════════════════
   WIDGET: POPUP DE CONVERSIÓN (v233 - Alineación Ruleta 10/10)
   ═══════════════════════════════════════════ */
function renderPopupConversion(w) {
  var elementId = "nvx-popup-" + w.id;
  if (document.getElementById(elementId)) return;

  var cfg = w.config || {};
  var freq = cfg.frequency || "once_per_visitor";
  var storageKey = "nvx_popup_seen_" + w.id;

  // Verificación de Frecuencia (1 vez por cliente / sesión)
  try {
    if (freq === "once_per_visitor" && window.localStorage && window.localStorage.getItem(storageKey)) {
      return;
    }
    if (freq === "once_per_session" && window.sessionStorage && window.sessionStorage.getItem(storageKey)) {
      return;
    }
  } catch(e) {}

  // Verificación Mobile
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile && cfg.enableMobile === false) {
    return;
  }

  var mode = cfg.mode || "ruleta"; // ruleta | cajas | email
  var title = cfg.title || "Antes de que te vayas";
  var subtitle = cfg.subtitle || "Te regalamos un descuento exclusivo para que uses ahora mismo.";
  var buttonText = cfg.buttonText || "Quiero mi descuento";
  var couponCode = cfg.couponCode || "NEVUX10";
  var discountValue = cfg.discountValue || 10;
  var requireEmail = cfg.requireEmail !== false;
  var timerMinutes = cfg.timerMinutes || 10;
  var delaySeconds = cfg.delaySeconds || 4;
  var bgColor = cfg.bgColor || "#ffffff";
  var textColor = cfg.textColor || "#111827";
  var accentColor = cfg.accentColor || "#10B981";
  var buttonBgColor = cfg.buttonBgColor || "#10B981";
  var buttonTextColor = cfg.buttonTextColor || "#ffffff";

  // Presets de campaña
  var THEMES = {
    "black-friday": { bg: "#111827", text: "#ffffff", accent: "#F59E0B", btn: "#F59E0B" },
    "hot-sale": { bg: "#0F172A", text: "#ffffff", accent: "#EF4444", btn: "#EF4444" },
    "cyber-monday": { bg: "#090D16", text: "#ffffff", accent: "#3B82F6", btn: "#3B82F6" },
    "navidad": { bg: "#064E3B", text: "#ffffff", accent: "#EF4444", btn: "#EF4444" },
    "san-valentin": { bg: "#831843", text: "#ffffff", accent: "#F43F5E", btn: "#F43F5E" },
    "dia-padre-madre": { bg: "#312E81", text: "#ffffff", accent: "#10B981", btn: "#10B981" },
    "liquidacion": { bg: "#7F1D1D", text: "#ffffff", accent: "#FBBF24", btn: "#FBBF24" }
  };

  if (cfg.campaignTheme && cfg.campaignTheme !== "none" && THEMES[cfg.campaignTheme]) {
    var th = THEMES[cfg.campaignTheme];
    bgColor = th.bg;
    textColor = th.text;
    accentColor = th.accent;
    buttonBgColor = th.btn;
  }

  // Timer diferido de apertura
  setTimeout(function() {
    if (document.getElementById(elementId)) return;

    // Inyección CSS
    var styleId = "style-" + elementId;
    if (!document.getElementById(styleId)) {
      var styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.type = "text/css";
      var css =
        "#" + elementId + " { " +
          "position: fixed !important; " +
          "top: 0 !important; left: 0 !important; " +
          "width: 100vw !important; height: 100vh !important; " +
          "background: rgba(0, 0, 0, 0.75) !important; " +
          "backdrop-filter: blur(5px) !important; " +
          "-webkit-backdrop-filter: blur(5px) !important; " +
          "z-index: 9999999 !important; " +
          "display: flex !important; " +
          "align-items: center !important; " +
          "justify-content: center !important; " +
          "padding: 16px !important; " +
          "box-sizing: border-box !important; " +
          "font-family: system-ui, -apple-system, sans-serif !important; " +
        "} " +
        "#" + elementId + " .nvx-popup-card { " +
          "background: " + bgColor + " !important; " +
          "color: " + textColor + " !important; " +
          "border-radius: 20px !important; " +
          "padding: 22px 18px !important; " +
          "max-width: 360px !important; " +
          "width: 100% !important; " +
          "text-align: center !important; " +
          "position: relative !important; " +
          "box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4) !important; " +
          "box-sizing: border-box !important; " +
          "animation: nvxPopIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important; " +
        "} " +
        "@keyframes nvxPopIn { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } } " +
        "#" + elementId + " .nvx-close-btn { " +
          "position: absolute !important; top: 12px !important; right: 14px !important; " +
          "font-size: 18px !important; cursor: pointer !important; opacity: 0.6 !important; " +
          "font-weight: 800 !important; border: none !important; background: none !important; color: " + textColor + " !important; " +
        "} " +
        "#" + elementId + " .nvx-close-btn:hover { opacity: 1 !important; } " +
        "#" + elementId + " .nvx-wheel-outer { " +
          "position: relative !important; width: 170px !important; height: 170px !important; margin: 12px auto !important; " +
        "} " +
        "#" + elementId + " .nvx-wheel-container { " +
          "width: 100% !important; height: 100% !important; border-radius: 50% !important; " +
          "box-shadow: 0 6px 18px rgba(0,0,0,0.18) !important; " +
          "transition: transform 3.5s cubic-bezier(0.15, 0.9, 0.2, 1) !important; " +
        "} " +
        "#" + elementId + " .nvx-wheel-pointer { " +
          "position: absolute !important; top: -8px !important; left: 50% !important; " +
          "transform: translateX(-50%) !important; z-index: 10 !important; " +
          "width: 0 !important; height: 0 !important; " +
          "border-left: 9px solid transparent !important; " +
          "border-right: 9px solid transparent !important; " +
          "border-top: 16px solid #111827 !important; " +
          "filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)) !important; " +
        "} " +
        "#" + elementId + " .nvx-boxes-row { " +
          "display: flex !important; justify-content: center !important; gap: 10px !important; margin: 14px 0 !important; " +
        "} " +
        "#" + elementId + " .nvx-box-item { " +
          "color: #ffffff !important; " +
          "width: 68px !important; height: 68px !important; border-radius: 14px !important; " +
          "display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; " +
          "font-size: 24px !important; cursor: pointer !important; transition: transform 0.2s, box-shadow 0.2s !important; " +
          "box-shadow: 0 6px 16px rgba(0,0,0,0.12) !important; user-select: none !important; " +
        "} " +
        "#" + elementId + " .nvx-box-item:hover { transform: translateY(-4px) scale(1.05) !important; } " +
        "#" + elementId + " .nvx-input-email { " +
          "width: 100% !important; padding: 12px 14px !important; font-size: 14px !important; " +
          "border: 1.5px solid #e5e7eb !important; border-radius: 12px !important; " +
          "margin-bottom: 12px !important; box-sizing: border-box !important; text-align: center !important; " +
          "outline: none !important; " +
        "} " +
        "#" + elementId + " .nvx-submit-btn { " +
          "width: 100% !important; background: " + buttonBgColor + " !important; color: " + buttonTextColor + " !important; " +
          "border: none !important; border-radius: 12px !important; padding: 14px !important; " +
          "font-size: 15px !important; font-weight: 800 !important; cursor: pointer !important; " +
          "box-shadow: 0 4px 14px rgba(0,0,0,0.15) !important; transition: transform 0.1s !important; " +
        "} " +
        "#" + elementId + " .nvx-submit-btn:active { transform: scale(0.98) !important; } " +
        "#" + elementId + " .nvx-coupon-box { " +
          "background: rgba(16,185,129,0.08) !important; border: 2px dashed " + accentColor + " !important; " +
          "border-radius: 14px !important; padding: 16px !important; margin: 14px 0 !important; " +
        "} " +
        "#" + elementId + " .nvx-coupon-code { " +
          "font-size: 24px !important; font-weight: 900 !important; letter-spacing: 2px !important; " +
          "color: " + accentColor + " !important; margin-bottom: 6px !important; font-family: monospace !important; " +
        "}";
      styleEl.appendChild(document.createTextNode(css));
      document.head.appendChild(styleEl);
    }

    var popupOverlay = document.createElement("div");
    popupOverlay.id = elementId;

    // Marca de visto en storage
    function markAsSeen() {
      try {
        if (freq === "once_per_visitor" && window.localStorage) {
          window.localStorage.setItem(storageKey, "1");
        } else if (freq === "once_per_session" && window.sessionStorage) {
          window.sessionStorage.setItem(storageKey, "1");
        }
      } catch(e) {}
    }

    // Cerrar Popup
    window["nvxClosePopup_" + w.id] = function() {
      markAsSeen();
      if (popupOverlay.parentNode) {
        popupOverlay.parentNode.removeChild(popupOverlay);
      }
    };

    // Copiar Cupón
    window["nvxCopyCoupon_" + w.id] = function(btn) {
      try {
        navigator.clipboard.writeText(couponCode);
      } catch(e) {}
      var prev = btn.innerHTML;
      btn.innerHTML = "¡Copiado al portapapeles! ✓";
      setTimeout(function() { btn.innerHTML = prev; }, 2000);
    };

    // Ejecutar Juego / Revelar
    window["nvxPlayPopup_" + w.id] = function() {
      var emailInput = popupOverlay.querySelector("input[type='email']");
      if (requireEmail && emailInput && !emailInput.value) {
        emailInput.style.borderColor = "#ef4444";
        emailInput.focus();
        return;
      }

      markAsSeen();

      var bodyBox = popupOverlay.querySelector(".nvx-popup-body");
      if (!bodyBox) return;

      // Animar si es ruleta
      var wheel = popupOverlay.querySelector(".nvx-wheel-container");
      if (wheel) {
        wheel.style.transform = "rotate(1440deg)";
      }

      setTimeout(function() {
        var totalSec = timerMinutes * 60;

        bodyBox.innerHTML =
          '<div style="font-size:36px !important;margin-bottom:8px !important;">🎉</div>' +
          '<div style="font-size:19px !important;font-weight:900 !important;color:' + textColor + ' !important;">' + discountValue + '% OFF DESBLOQUEADO</div>' +
          '<div style="font-size:12px !important;opacity:0.75 !important;margin-bottom:12px !important;">¡Felicitaciones! Usá este código al finalizar tu compra:</div>' +
          '<div class="nvx-coupon-box">' +
            '<div class="nvx-coupon-code">' + (typeof escapeHtml === "function" ? escapeHtml(couponCode) : couponCode) + '</div>' +
            '<div style="font-size:11px !important;opacity:0.65 !important;">Tocá el botón de abajo para copiarlo</div>' +
          '</div>' +
          '<div style="font-size:13px !important;font-weight:800 !important;color:' + accentColor + ' !important;margin-bottom:14px !important;" id="nvx-timer-' + w.id + '">' +
            '⏱️ Expira en: ' + timerMinutes + ':00' +
          '</div>' +
          '<button type="button" class="nvx-submit-btn" onclick="window[\'nvxCopyCoupon_' + w.id + '\'](this);">📋 Copiar Código y Comprar</button>';

        // Activar Cuenta Regresiva de Cupón
        var timerEl = document.getElementById("nvx-timer-" + w.id);
        if (timerEl) {
          var timerInterval = setInterval(function() {
            totalSec--;
            if (totalSec <= 0) {
              clearInterval(timerInterval);
              timerEl.innerHTML = "⏰ ¡Cupón expirado!";
              return;
            }
            var m = Math.floor(totalSec / 60);
            var s = totalSec % 60;
            var mStr = m < 10 ? "0" + m : m;
            var sStr = s < 10 ? "0" + s : s;
            timerEl.innerHTML = "⏱️ Expira en: " + mStr + ":" + sStr;
          }, 1000);
        }
      }, mode === "ruleta" ? 2200 : 200);
    };

    // Constructores visuales según Modo
    var titleHtml = '<div style="font-size:20px !important;font-weight:900 !important;margin-bottom:6px !important;color:' + textColor + ' !important;">' + (typeof escapeHtml === "function" ? escapeHtml(title) : title) + '</div>';
    var subHtml = '<div style="font-size:13px !important;opacity:0.8 !important;line-height:1.4 !important;margin-bottom:14px !important;color:' + textColor + ' !important;">' + (typeof escapeHtml === "function" ? escapeHtml(subtitle) : subtitle) + '</div>';
    var closeBtnHtml = '<button class="nvx-close-btn" onclick="window[\'nvxClosePopup_' + w.id + '\']();">✕</button>';

    var modeHtml = "";
    if (mode === "ruleta") {
      // SVG Rueda con posiciones (X,Y) exactas alineadas al centro de cada gajo
      var wheelSvg =
        '<svg viewBox="0 0 200 200" style="width:100% !important;height:100% !important;">' +
          '<g transform="translate(100,100)">' +
            '<path d="M0,0 L0,-100 A100,100 0 0,1 86.6,-50 Z" fill="#10B981" />' +
            '<path d="M0,0 L86.6,-50 A100,100 0 0,1 86.6,50 Z" fill="#F59E0B" />' +
            '<path d="M0,0 L86.6,50 A100,100 0 0,1 0,100 Z" fill="#EF4444" />' +
            '<path d="M0,0 L0,100 A100,100 0 0,1 -86.6,50 Z" fill="#3B82F6" />' +
            '<path d="M0,0 L-86.6,50 A100,100 0 0,1 -86.6,-50 Z" fill="#8B5CF6" />' +
            '<path d="M0,0 L-86.6,-50 A100,100 0 0,1 0,-100 Z" fill="#EC4899" />' +
            '<text x="31" y="-54" text-anchor="middle" dominant-baseline="central" fill="#ffffff" font-size="12" font-weight="900">10%</text>' +
            '<text x="62" y="0" text-anchor="middle" dominant-baseline="central" fill="#ffffff" font-size="12" font-weight="900">15%</text>' +
            '<text x="31" y="54" text-anchor="middle" dominant-baseline="central" fill="#ffffff" font-size="12" font-weight="900">20%</text>' +
            '<text x="-31" y="54" text-anchor="middle" dominant-baseline="central" fill="#ffffff" font-size="12" font-weight="900">5%</text>' +
            '<text x="-62" y="0" text-anchor="middle" dominant-baseline="central" fill="#ffffff" font-size="12" font-weight="900">25%</text>' +
            '<text x="-31" y="-54" text-anchor="middle" dominant-baseline="central" fill="#ffffff" font-size="14" font-weight="900">🎁</text>' +
            '<circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#111827" stroke-width="3" />' +
            '<text x="0" y="3" text-anchor="middle" dominant-baseline="central" fill="#111827" font-size="9" font-weight="900">GIRAR</text>' +
          '</g>' +
        '</svg>';

      modeHtml =
        '<div class="nvx-wheel-outer">' +
          '<div class="nvx-wheel-pointer"></div>' +
          '<div class="nvx-wheel-container" onclick="window[\'nvxPlayPopup_' + w.id + '\']();">' + wheelSvg + '</div>' +
        '</div>';
    } else if (mode === "cajas") {
      modeHtml =
        '<div style="font-size:12px !important;font-weight:700 !important;color:' + accentColor + ' !important;margin-bottom:6px !important;">¡Elegí una caja y descubrí tu premio!</div>' +
        '<div class="nvx-boxes-row">' +
          '<div class="nvx-box-item" style="background:#8B5CF6 !important;" onclick="window[\'nvxPlayPopup_' + w.id + '\']();">🎁<span style="font-size:9px !important;font-weight:800 !important;margin-top:2px !important;">Caja 1</span></div>' +
          '<div class="nvx-box-item" style="background:#10B981 !important;" onclick="window[\'nvxPlayPopup_' + w.id + '\']();">🎁<span style="font-size:9px !important;font-weight:800 !important;margin-top:2px !important;">Caja 2</span></div>' +
          '<div class="nvx-box-item" style="background:#F59E0B !important;" onclick="window[\'nvxPlayPopup_' + w.id + '\']();">🎁<span style="font-size:9px !important;font-weight:800 !important;margin-top:2px !important;">Caja 3</span></div>' +
        '</div>';
    } else {
      modeHtml =
        '<div style="background:rgba(16,185,129,0.08) !important;border:2px dashed ' + accentColor + ' !important;border-radius:14px !important;padding:12px !important;margin:12px 0 16px !important;display:flex !important;align-items:center !important;justify-content:center !important;gap:10px !important;">' +
          '<span style="font-size:28px !important;">🏷️</span>' +
          '<div style="text-align:left !important;">' +
            '<div style="font-size:15px !important;font-weight:900 !important;color:' + accentColor + ' !important;">' + discountValue + '% OFF DE REGALO</div>' +
            '<div style="font-size:11px !important;opacity:0.75 !important;">Ingresá tu correo para desbloquearlo</div>' +
          '</div>' +
        '</div>';
    }

    var emailHtml = requireEmail ? '<input type="email" class="nvx-input-email" placeholder="Ingresá tu correo electrónico..." />' : '';
    var actionBtnHtml = '<button type="button" class="nvx-submit-btn" onclick="window[\'nvxPlayPopup_' + w.id + '\']();">' + (typeof escapeHtml === "function" ? escapeHtml(buttonText) : buttonText) + '</button>';

    popupOverlay.innerHTML =
      '<div class="nvx-popup-card">' +
        closeBtnHtml +
        '<div class="nvx-popup-body">' +
          titleHtml +
          subHtml +
          modeHtml +
          emailHtml +
          actionBtnHtml +
        '</div>' +
      '</div>';

    document.body.appendChild(popupOverlay);

    if (typeof nvxTrack === "function") {
      nvxTrack(w.id, "impression");
    }
  }, delaySeconds * 1000);
}
  /* ═══════════════════════════════════════════
   WIDGET #7: BARRA DE ENVÍO GRATIS (v23 - Conversor Centavos a Pesos)
   ═══════════════════════════════════════════ */
function renderBarraEnvioGratis(w) {
  var idBase = "nvx-shipbar-" + w.id;
  if (window['nvx_shipbar_' + w.id]) return;
  window['nvx_shipbar_' + w.id] = true;

  var cfg = w.config || {};
  var template = cfg.template || "moderna";
  var minAmount = parseFloat(cfg.minAmount) || 50000;
  var size = cfg.size || "normal";
  var desktopPos = cfg.desktopPos || "top";
  var useZones = !!cfg.useZones;
  var zones = cfg.zones || [];
  var iconType = cfg.iconType || "fontawesome";
  var emojiIcon = cfg.emojiIcon || "🚚";
  var msgProgress = cfg.msgProgress || "Te faltan {{remaining}} para tener ENVÍO GRATIS";
  var urgencyAmount = parseFloat(cfg.urgencyAmount) || 0;
  var msgUrgency = cfg.msgUrgency || "¡Solo {{remaining}} más, apurate! 🔥";
  var msgSuccess = cfg.msgSuccess || "Listo, tenés ENVÍO GRATIS 🎉";
  var mobilePos = cfg.mobilePos || "same";
  var stickyGlobal = cfg.stickyGlobal !== false;
  var inCartDrawer = !!cfg.inCartDrawer;
  var inProductBanner = !!cfg.inProductBanner;
  var bgColor = cfg.bgColor || "#111827";
  var barColor = cfg.barColor || "#10B981";
  var textColor = cfg.textColor || "#ffffff";

  var THEMES = {
    "black-friday": { bg: "#111827", bar: "#F59E0B", text: "#ffffff" },
    "hot-sale": { bg: "#0F172A", bar: "#EF4444", text: "#ffffff" },
    "cyber-monday": { bg: "#090D16", bar: "#3B82F6", text: "#ffffff" },
    "navidad": { bg: "#064E3B", bar: "#EF4444", text: "#ffffff" },
    "san-valentin": { bg: "#831843", bar: "#F43F5E", text: "#ffffff" },
    "dia-padre-madre": { bg: "#312E81", bar: "#10B981", text: "#ffffff" },
    "liquidacion": { bg: "#7F1D1D", bar: "#FBBF24", text: "#ffffff" }
  };
  if (cfg.campaignTheme && cfg.campaignTheme !== "none" && THEMES[cfg.campaignTheme]) {
    bgColor = THEMES[cfg.campaignTheme].bg;
    barColor = THEMES[cfg.campaignTheme].bar;
    textColor = THEMES[cfg.campaignTheme].text;
  }

  var idSticky = idBase + "-sticky";
  var idProd = idBase + "-prod";
  var idCart = idBase + "-cart";

  var currentCartTotal = 0;

  // PARSER DE TEXTO A NÚMERO
  function parseMoneyValue(val) {
    if (typeof val === "number") {
      if (isNaN(val)) return 0;
      return val;
    }
    if (!val) return 0;
    var str = String(val).trim();
    if (!str) return 0;
    str = str.replace(/[^0-9,\.]/g, "");
    if (!str) return 0;

    if (str.indexOf(",") !== -1 && str.indexOf(".") !== -1) {
      if (str.lastIndexOf(",") > str.lastIndexOf(".")) {
        str = str.replace(/\./g, "").replace(",", ".");
      } else {
        str = str.replace(/,/g, "");
      }
    } else if (str.indexOf(",") !== -1) {
      var cParts = str.split(",");
      if (cParts.length === 2 && cParts[1].length === 2) {
        str = cParts[0] + "." + cParts[1];
      } else {
        str = str.replace(/,/g, "");
      }
    } else if (str.indexOf(".") !== -1) {
      var pParts = str.split(".");
      if (pParts.length > 2) {
        str = str.replace(/\./g, "");
      } else if (pParts.length === 2) {
        var intPart = pParts[0];
        var decPart = pParts[1];
        if (decPart.length === 3 || decPart.length >= 4) {
          str = intPart + decPart;
        }
      }
    }

    var parsed = parseFloat(str) || 0;
    return parsed;
  }

  // CONVERSOR DE CENTAVOS TIENDANUBE A PESOS REALES
  function normalizeToPesos(rawVal) {
    if (rawVal === undefined || rawVal === null) return 0;
    var val = parseMoneyValue(rawVal);
    if (val <= 0) return 0;

    // Tiendanube LS.cart.total viene en centavos (3.500.000 para $35.000,00)
    // Si el valor es mayor a 100.000 y termina en 0, son centavos -> dividir por 100
    if (val >= 100000 && val % 10 === 0) {
      return val / 100;
    }
    if (val >= 500000) {
      return val / 100;
    }
    return val;
  }

  function readFromDOM() {
    var domSelectors = [
      ".js-ajax-cart-total",
      ".js-cart-total",
      ".js-cart-subtotal",
      ".js-ajax-cart-subtotal",
      ".js-cart-widget-amount",
      ".cart-total-amount",
      ".cart-subtotal-amount",
      ".cart-total .js-price",
      ".cart-total",
      ".cart-subtotal",
      "[data-component='cart.total']",
      "[data-component='cart.subtotal']",
      ".js-cart-panel .js-cart-total",
      ".js-modal-cart .js-cart-total",
      "#cart-total",
      "#ajax-cart-total"
    ];
    for (var d = 0; d < domSelectors.length; d++) {
      var els = document.querySelectorAll(domSelectors[d]);
      for (var e = 0; e < els.length; e++) {
        var txt = els[e].textContent || els[e].innerText || "";
        if (txt && txt.replace(/[^0-9]/g, "").length > 0) {
          var pVal = normalizeToPesos(txt);
          if (pVal > 0) return pVal;
        }
      }
    }
    return 0;
  }

  function readCartTotal() {
    try {
      if (window.LS && window.LS.cart) {
        if (window.LS.cart.subtotal_in_cents && window.LS.cart.subtotal_in_cents > 0) {
          return window.LS.cart.subtotal_in_cents / 100;
        }
        if (window.LS.cart.total_in_cents && window.LS.cart.total_in_cents > 0) {
          return window.LS.cart.total_in_cents / 100;
        }
        if (window.LS.cart.items && window.LS.cart.items.length > 0) {
          var sum = 0;
          for (var i = 0; i < window.LS.cart.items.length; i++) {
            var item = window.LS.cart.items[i];
            var rawPrice = item.price !== undefined ? item.price : (item.unit_price !== undefined ? item.unit_price : item.final_price);
            var p = normalizeToPesos(rawPrice);
            var q = parseInt(item.quantity || item.qty || 1, 10) || 1;
            sum += (p * q);
          }
          if (sum > 0) return sum;
        }
        if (window.LS.cart.subtotal !== undefined && window.LS.cart.subtotal !== null && window.LS.cart.subtotal !== "") {
          var subVal = normalizeToPesos(window.LS.cart.subtotal);
          if (subVal > 0) return subVal;
        }
        if (window.LS.cart.total !== undefined && window.LS.cart.total !== null && window.LS.cart.total !== "") {
          var totVal = normalizeToPesos(window.LS.cart.total);
          if (totVal > 0) return totVal;
        }
      }
    } catch(e) {}

    try {
      var domVal = readFromDOM();
      if (domVal > 0) return domVal;
    } catch(e) {}

    return 0;
  }

  function fetchCartTotal() {
    var localVal = readCartTotal();
    if (localVal > 0 || (window.LS && window.LS.cart && window.LS.cart.items && window.LS.cart.items.length === 0)) {
      currentCartTotal = localVal;
      updateRenderedBars();
    }

    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "/cart.json", true);
      xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          try {
            var cartData = JSON.parse(xhr.responseText);
            if (cartData) {
              var fetchedTotal = 0;
              if (cartData.subtotal_in_cents && cartData.subtotal_in_cents > 0) {
                fetchedTotal = cartData.subtotal_in_cents / 100;
              } else if (cartData.total_in_cents && cartData.total_in_cents > 0) {
                fetchedTotal = cartData.total_in_cents / 100;
              } else if (cartData.items && cartData.items.length > 0) {
                for (var k = 0; k < cartData.items.length; k++) {
                  var itm = cartData.items[k];
                  var rawP = itm.price !== undefined ? itm.price : (itm.unit_price !== undefined ? itm.unit_price : itm.final_price);
                  var ip = normalizeToPesos(rawP);
                  var iq = parseInt(itm.quantity || itm.qty || 1, 10) || 1;
                  fetchedTotal += (ip * iq);
                }
              }
              if (fetchedTotal <= 0 && cartData.subtotal !== undefined) fetchedTotal = normalizeToPesos(cartData.subtotal);
              if (fetchedTotal <= 0 && cartData.total !== undefined) fetchedTotal = normalizeToPesos(cartData.total);

              if (fetchedTotal > 0 || cartData.items_count === 0 || (cartData.items && cartData.items.length === 0)) {
                currentCartTotal = fetchedTotal;
                updateRenderedBars();
              }
            }
          } catch(err) {
            var domVal2 = readFromDOM();
            if (domVal2 > 0) {
              currentCartTotal = domVal2;
              updateRenderedBars();
            }
          }
        }
      };
      xhr.send();
    } catch(e) {}
  }

  currentCartTotal = readCartTotal();
  fetchCartTotal();

  setTimeout(fetchCartTotal, 300);
  setTimeout(fetchCartTotal, 800);
  setTimeout(fetchCartTotal, 1500);
  setTimeout(fetchCartTotal, 3000);

  document.addEventListener("ajaxCart:receive", fetchCartTotal);
  document.addEventListener("cart:updated", fetchCartTotal);
  document.addEventListener("cart:change", fetchCartTotal);
  document.addEventListener("product_added_to_cart", fetchCartTotal);
  window.addEventListener("LS:cart:updated", fetchCartTotal);

  try {
    if (window.jQuery) {
      window.jQuery(document).ajaxComplete(function() {
        setTimeout(fetchCartTotal, 300);
        setTimeout(fetchCartTotal, 1000);
      });
    }
  } catch(e) {}

  try {
    if (window.MutationObserver && document.body) {
      var cartObserver = new MutationObserver(function() {
        var curDom = readCartTotal();
        if (curDom > 0 && curDom !== currentCartTotal) {
          currentCartTotal = curDom;
          updateRenderedBars();
        }
      });
      cartObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  } catch(e) {}

  document.addEventListener("click", function(e) {
    try {
      var target = e.target;
      if (!target) return;
      var current = target;
      var isAddToCart = false;

      while (current && current !== document && current.nodeType === 1) {
        var classes = (current.className && typeof current.className === "string") ? current.className : (current.getAttribute ? (current.getAttribute("class") || "") : "");
        var type = current.type || "";
        var id = current.id || "";

        if (
          classes.indexOf("js-add-to-cart-btn") !== -1 ||
          classes.indexOf("js-prod-submit-form") !== -1 ||
          classes.indexOf("product-buy-container") !== -1 ||
          classes.indexOf("js-product-buy-container") !== -1 ||
          classes.indexOf("js-cart-quantity-btn") !== -1 ||
          (type === "submit" && classes.indexOf("js-add-to-cart") !== -1) ||
          id.indexOf("add-to-cart") !== -1
        ) {
          isAddToCart = true;
          break;
        }
        current = current.parentNode;
      }

      if (isAddToCart) {
        setTimeout(fetchCartTotal, 400);
        setTimeout(fetchCartTotal, 1000);
        setTimeout(fetchCartTotal, 2000);
        setTimeout(fetchCartTotal, 3500);
        setTimeout(fetchCartTotal, 5000);
      }
    } catch(err) {}
  }, true);

  var targetMin = minAmount;
  if (useZones && zones.length > 0) {
    var userZip = "";
    try {
      if (window.LS && window.LS.cart && window.LS.cart.shipping_zipcode) {
        userZip = String(window.LS.cart.shipping_zipcode).trim();
      }
    } catch(e) {}

    if (userZip) {
      var matched = false;
      for (var z = 0; z < zones.length; z++) {
        var zone = zones[z];
        if (zone.zipCodes) {
          if (zone.zipCodes === "*") { targetMin = parseFloat(zone.amount); matched = true; }
          else if (zone.zipCodes.indexOf("-") !== -1) {
            var parts = zone.zipCodes.split("-");
            if (parseInt(userZip, 10) >= parseInt(parts[0], 10) && parseInt(userZip, 10) <= parseInt(parts[1], 10)) {
              targetMin = parseFloat(zone.amount); matched = true; break;
            }
          } else if (zone.zipCodes.indexOf(userZip) !== -1) {
            targetMin = parseFloat(zone.amount); matched = true; break;
          }
        }
      }
      if (!matched && zones[0]) targetMin = parseFloat(zones[0].amount) || targetMin;
    } else if (zones[0]) {
      targetMin = parseFloat(zones[0].amount) || targetMin;
    }
  }

  function formatMoney(val) {
    var str = Math.round(val).toString();
    var res = ""; var count = 0;
    for (var i = str.length - 1; i >= 0; i--) {
      count++; res = str.charAt(i) + res;
      if (count % 3 === 0 && i !== 0) res = "." + res;
    }
    return "$" + res;
  }

  function buildInnerHtml(currentTotal) {
    var remaining = targetMin - currentTotal;
    if (remaining < 0) remaining = 0;

    var pct = targetMin > 0 ? Math.min(100, Math.round((currentTotal / targetMin) * 100)) : 100;
    var displayText = msgSuccess;
    if (remaining > 0) {
      if (urgencyAmount > 0 && remaining <= urgencyAmount) displayText = msgUrgency.replace("{{remaining}}", formatMoney(remaining));
      else displayText = msgProgress.replace("{{remaining}}", formatMoney(remaining));
    }

    var iconHtml = iconType === "emoji" 
      ? '<span style="font-size:18px !important;line-height:1 !important;display:inline-block !important;">' + emojiIcon + '</span>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="' + barColor + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block !important;flex-shrink:0 !important;"><rect x="1" y="3" width="15" height="13" rx="2" ry="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>';

    var progressHtml = "";
    if (remaining === 0) {
      progressHtml = '<div style="width:24px !important;height:24px !important;min-width:24px !important;border-radius:50% !important;background:' + barColor + ' !important;color:#ffffff !important;display:flex !important;align-items:center !important;justify-content:center !important;font-weight:900 !important;font-size:13px !important;flex-shrink:0 !important;box-shadow:0 2px 6px rgba(0,0,0,0.2) !important;line-height:1 !important;">✓</div>';
    } else {
      var barH = template === "bold" ? "10px" : (template === "minimal" ? "4px" : "7px");
      var barW = template === "minimal" ? "70px" : "90px";
      progressHtml = '<div style="width:' + barW + ' !important;min-width:' + barW + ' !important;height:' + barH + ' !important;background:rgba(255,255,255,0.2) !important;border-radius:999px !important;overflow:hidden !important;position:relative !important;flex-shrink:0 !important;">' +
        '<div style="width:' + pct + '% !important;height:100% !important;background:' + barColor + ' !important;border-radius:999px !important;transition:width 0.4s ease !important;' + (template === "neon" ? 'box-shadow:0 0 8px ' + barColor + ' !important;' : '') + '"></div>' +
      '</div>';
    }

    return '<div style="display:flex !important;align-items:center !important;justify-content:space-between !important;gap:8px !important;width:100% !important;max-width:1100px !important;margin:0 auto !important;box-sizing:border-box !important;height:auto !important;min-height:0 !important;">' +
      '<div style="display:flex !important;align-items:center !important;flex-shrink:0 !important;">' + iconHtml + '</div>' +
      '<div style="flex:1 1 auto !important;font-size:' + (size === "small" ? "11.5px" : (size === "large" ? "14px" : "12.5px")) + ' !important;font-weight:800 !important;line-height:1.25 !important;text-align:' + (template === "minimal" ? "left" : "center") + ' !important;color:' + textColor + ' !important;overflow:hidden !important;text-overflow:ellipsis !important;white-space:normal !important;">' + displayText + '</div>' +
      progressHtml +
    '</div>';
  }

  var styleId = "style-" + idBase;
  if (!document.getElementById(styleId)) {
    var padCss = size === "small" ? "6px 12px" : (size === "large" ? "12px 18px" : "9px 14px");
    var bgCss = template === "oscura" ? "#000000" : (template === "neon" ? "#090D16" : bgColor);
    var borderCss = template === "neon" ? "1.5px solid " + barColor : "none";
    var radiusCss = template === "flotante" ? "999px" : (template === "moderna" ? "10px" : "0px");
    var shadowCss = template === "neon" ? "box-shadow: 0 0 12px " + barColor + "60 !important;" : "box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important;";

    var deskTopCss = (desktopPos === "top") ? "top:0 !important;bottom:auto !important;" : "bottom:0 !important;top:auto !important;";

    var cssText = "";

    cssText += "#" + idSticky + ", #" + idProd + ", #" + idCart + " { " +
      "background: " + bgCss + " !important; border: " + borderCss + " !important; border-radius: " + radiusCss + " !important; " +
      "padding: " + padCss + " !important; color: " + textColor + " !important; box-sizing: border-box !important; " +
      "font-family: system-ui, -apple-system, sans-serif !important; " + shadowCss +
      "height: auto !important; min-height: 0 !important; max-height: 70px !important; overflow: hidden !important; " +
      "width: 100% !important; margin: 0 !important; " +
    "} ";

    cssText += "@media (min-width: 769px) { " +
      "html body #" + idSticky + " { " +
        "position: fixed !important; left: 0 !important; right: 0 !important; " +
        deskTopCss +
        "z-index: 999998 !important; display: block !important; " +
      "} ";

    if (template === "flotante") {
      cssText += "html body #" + idSticky + " { " +
        "width: calc(100% - 24px) !important; max-width: 1100px !important; " +
        "left: 0 !important; right: 0 !important; " +
        (desktopPos === "top" ? "margin: 8px auto 0 auto !important; top: 0 !important; bottom: auto !important; " : "margin: 0 auto 8px auto !important; bottom: 0 !important; top: auto !important; ") +
      "} ";
    }

    cssText += "} ";

    cssText += "@media (max-width: 768px) { ";
    if (mobilePos === "hide") {
      cssText += "html body #" + idSticky + " { display: none !important; } ";
    } else {
      var mobileFinalPos;
      if (mobilePos === "same") {
        mobileFinalPos = deskTopCss;
      } else if (mobilePos === "top") {
        mobileFinalPos = "top: 0 !important; bottom: auto !important;";
      } else if (mobilePos === "bottom") {
        mobileFinalPos = "bottom: 0 !important; top: auto !important;";
      } else {
        mobileFinalPos = deskTopCss;
      }

      cssText += "html body #" + idSticky + " { " +
        "position: fixed !important; left: 0 !important; right: 0 !important; " +
        mobileFinalPos +
        "z-index: 999998 !important; display: block !important; " +
      "} ";

      if (template === "flotante") {
        cssText += "html body #" + idSticky + " { " +
          "width: calc(100% - 16px) !important; left: 0 !important; right: 0 !important; " +
          (mobilePos === "bottom" ? "margin: 0 auto 6px auto !important;" : "margin: 6px auto 0 auto !important;") +
        "} ";
      }
    }
    cssText += "} ";

    cssText += "body.js-cart-slide-open #" + idSticky + ", body.js-modal-open #" + idSticky + ", .cart-active #" + idSticky + " { display: none !important; } ";

    var styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.type = "text/css";
    styleEl.setAttribute("data-nvx", "shipbar");
    styleEl.appendChild(document.createTextNode(cssText));
    (document.head || document.documentElement).appendChild(styleEl);
  }

  function findProductTarget() {
    var buySelectors = [
      "form[action*='/cart/add']",
      "form.js-product-form",
      ".js-product-buy-container",
      ".product-buy-container",
      "form.js-product-buyform",
      ".js-add-to-cart-btn",
      "#product_form"
    ];
    for (var sIdx = 0; sIdx < buySelectors.length; sIdx++) {
      var bEl = document.querySelector(buySelectors[sIdx]);
      if (bEl) return bEl;
    }
    return null;
  }

  function injectSticky() {
    if (!document.getElementById(idSticky)) {
      var container = document.createElement("div");
      container.id = idSticky;
      container.className = "nvx-widget nvx-shipbar-sticky";
      container.innerHTML = buildInnerHtml(currentCartTotal);
      if (document.body) document.body.appendChild(container);
    }
  }

  function injectProductBanner(isProductPageLocal) {
    if (!inProductBanner || !isProductPageLocal) return;
    if (!document.getElementById(idProd)) {
      var target = findProductTarget();
      if (target && target.parentNode) {
        var container = document.createElement("div");
        container.id = idProd;
        container.className = "nvx-widget nvx-shipbar-product";
        container.style.cssText = "margin: 16px 0 !important; width: 100% !important; max-height: 80px !important; overflow: hidden !important; display: block !important; box-sizing: border-box !important;";
        container.innerHTML = buildInnerHtml(currentCartTotal);
        target.parentNode.insertBefore(container, target.nextSibling);
      }
    }
  }

  function injectCartDrawer() {
    if (!inCartDrawer) return;
    if (!document.getElementById(idCart)) {
      var cartContainer = document.querySelector(".js-cart-panel, #cart-slide, .js-modal-cart, .cart-slide, .cart-summary, .js-cart-content, #shopping-cart");
      if (cartContainer) {
        var insertPoint = cartContainer.querySelector(".js-ajax-cart-list, .cart-body, .cart-table, .cart-row");
        if (insertPoint && insertPoint.parentNode) {
          var container = document.createElement("div");
          container.id = idCart;
          container.className = "nvx-widget nvx-shipbar-cart";
          container.style.cssText = "margin: 12px auto 0 !important; width: 94% !important; max-height: 80px !important; overflow: hidden !important; display: block !important; box-sizing: border-box !important;";
          container.innerHTML = buildInnerHtml(currentCartTotal);
          insertPoint.parentNode.insertBefore(container, insertPoint);
        }
      }
    }
  }

  function updateRenderedBars() {
    var cSticky = document.getElementById(idSticky);
    var cProd = document.getElementById(idProd);
    var cCart = document.getElementById(idCart);

    if (cSticky) cSticky.innerHTML = buildInnerHtml(currentCartTotal);
    if (cProd) cProd.innerHTML = buildInnerHtml(currentCartTotal);
    if (cCart) cCart.innerHTML = buildInnerHtml(currentCartTotal);
  }

  function syncEngine() {
    var isProdPage = (typeof detectPageType === "function" ? detectPageType() : "") === "product";

    var shouldShowStickyThisPage = stickyGlobal;
    if (isProdPage && inProductBanner) {
      shouldShowStickyThisPage = false;
    }

    if (shouldShowStickyThisPage) {
      injectSticky();
    } else {
      var cStickyNow = document.getElementById(idSticky);
      if (cStickyNow && cStickyNow.parentNode) {
        cStickyNow.parentNode.removeChild(cStickyNow);
      }
    }

    if (inProductBanner && isProdPage) {
      injectProductBanner(true);
    } else {
      var cProd = document.getElementById(idProd);
      if (cProd && cProd.parentNode) {
        cProd.parentNode.removeChild(cProd);
      }
    }

    if (inCartDrawer) {
      injectCartDrawer();
    }

    updateRenderedBars();
  }

  syncEngine();
  setInterval(syncEngine, 2000);
  setInterval(fetchCartTotal, 2500);

  if (typeof nvxTrack === "function") {
    nvxTrack(w.id, "impression");
  }
    }
/* ═══════════════════════════════════════════
   WIDGET #8: BARRA DE CUOTAS SIN INTERÉS (v3 - Universal Price & Variant Engine)
   ═══════════════════════════════════════════ */
function renderBarraCuotas(w) {
  var idBase = "nvx-cuotasbar-" + w.id;
  if (window['nvx_cuotasbar_' + w.id]) return;
  window['nvx_cuotasbar_' + w.id] = true;

  var cfg = w.config || {};
  var cuotas = parseInt(cfg.cuotas, 10) || 3;
  var minAmount = parseFloat(cfg.minAmount) || 0;
  var msgDefault = (cfg.msgDefault && String(cfg.msgDefault).trim()) ? String(cfg.msgDefault) : "¡Hasta {{cuotas}} cuotas sin interés en toda la tienda! 🎉";
  var msgCalculated = (cfg.msgCalculated && String(cfg.msgCalculated).trim()) ? String(cfg.msgCalculated) : "Pagá en {{cuotas}} cuotas sin interés de {{monto_cuota}}";
  var template = cfg.template || "moderna";
  var size = cfg.size || "normal";
  var desktopPos = cfg.desktopPos || "top";
  var mobilePos = cfg.mobilePos || "same";
  var iconType = cfg.iconType || "emoji";
  var emojiIcon = cfg.emojiIcon || "💳";
  var stickyGlobal = cfg.stickyGlobal !== false;
  var inCartDrawer = !!cfg.inCartDrawer;
  var inProductBanner = cfg.inProductBanner !== false;
  var bgColor = cfg.bgColor || "#111827";
  var accentColor = cfg.accentColor || "#10B981";
  var textColor = cfg.textColor || "#ffffff";
  var customBorder = "none";
  var customShadow = "box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important;";

  var THEMES = {
    "black-friday": { bg: "#111827", acc: "#F59E0B", text: "#F59E0B", border: "1.5px solid #F59E0B", shadow: "0 0 12px rgba(245,158,11,0.4)" },
    "hot-sale": { bg: "#0F172A", acc: "#EF4444", text: "#ffffff", border: "1.5px solid #EF4444", shadow: "0 0 12px rgba(239,68,68,0.4)" },
    "cyber-monday": { bg: "#090D16", acc: "#3B82F6", text: "#60A5FA", border: "1.5px solid #3B82F6", shadow: "0 0 12px rgba(59,130,246,0.5)" },
    "navidad": { bg: "#064E3B", acc: "#EF4444", text: "#ffffff", border: "1.5px solid #EF4444", shadow: "0 0 10px rgba(16,185,129,0.3)" },
    "san-valentin": { bg: "#831843", acc: "#F43F5E", text: "#ffffff", border: "1.5px solid #F43F5E", shadow: "0 0 10px rgba(244,63,94,0.3)" },
    "dia-padre-madre": { bg: "#312E81", acc: "#10B981", text: "#ffffff", border: "1.5px solid #10B981", shadow: "0 0 10px rgba(16,185,129,0.3)" },
    "liquidacion": { bg: "#7F1D1D", acc: "#FBBF24", text: "#FBBF24", border: "1.5px solid #FBBF24", shadow: "0 0 10px rgba(251,191,36,0.4)" }
  };

  if (cfg.campaignTheme && cfg.campaignTheme !== "none" && THEMES[cfg.campaignTheme]) {
    var tm = THEMES[cfg.campaignTheme];
    bgColor = tm.bg;
    accentColor = tm.acc;
    textColor = tm.text;
    customBorder = tm.border;
    if (tm.shadow) customShadow = "box-shadow: " + tm.shadow + " !important;";
  }

  var idSticky = idBase + "-sticky";
  var idProd = idBase + "-prod";
  var idCart = idBase + "-cart";

  var currentPrice = 0;

  function parseMoneyValue(val) {
    if (typeof val === "number") {
      if (isNaN(val)) return 0;
      return val;
    }
    if (!val) return 0;
    var str = String(val).trim().replace(/[^0-9,\.]/g, "");
    if (!str) return 0;

    if (str.indexOf(",") !== -1 && str.indexOf(".") !== -1) {
      if (str.lastIndexOf(",") > str.lastIndexOf(".")) {
        str = str.replace(/\./g, "").replace(",", ".");
      } else {
        str = str.replace(/,/g, "");
      }
    } else if (str.indexOf(",") !== -1) {
      var cParts = str.split(",");
      if (cParts.length === 2 && cParts[1].length === 2) {
        str = cParts[0] + "." + cParts[1];
      } else {
        str = str.replace(/,/g, "");
      }
    } else if (str.indexOf(".") !== -1) {
      var pParts = str.split(".");
      if (pParts.length === 2 && (pParts[1].length === 3 || pParts[1].length >= 4)) {
        str = pParts[0] + pParts[1];
      }
    }
    return parseFloat(str) || 0;
  }

  function normalizeToPesos(rawVal) {
    if (rawVal === undefined || rawVal === null) return 0;
    var val = parseMoneyValue(rawVal);
    if (val <= 0) return 0;
    if (val >= 100000 && val % 10 === 0) return val / 100;
    if (val >= 500000) return val / 100;
    return val;
  }

  function detectProductPrice() {
    try {
      if (window.LS && window.LS.product) {
        var p = window.LS.product;
        var rawP = (p.promotional_price !== undefined && p.promotional_price !== null && p.promotional_price !== 0 && p.promotional_price !== "0")
          ? p.promotional_price
          : p.price;
        if (rawP) {
          var pVal = normalizeToPesos(rawP);
          if (pVal > 0) return pVal;
        }
      }
    } catch(e) {}

    try {
      if (window.LS && window.LS.variant && window.LS.variant.price) {
        var vVal = normalizeToPesos(window.LS.variant.price);
        if (vVal > 0) return vVal;
      }
    } catch(e) {}

    var priceSelectors = [
      "#price_display",
      ".js-price-display",
      ".js-product-price",
      "[data-product-price]",
      ".product-price",
      ".price-display",
      ".js-price-container",
      "#product-price",
      ".js-compare-price-display",
      "[data-component='product.price']",
      ".js-price",
      ".price-product"
    ];

    for (var i = 0; i < priceSelectors.length; i++) {
      var els = document.querySelectorAll(priceSelectors[i]);
      for (var j = 0; j < els.length; j++) {
        var el = els[j];
        if (!el) continue;
        var cls = (el.className || "").toString().toLowerCase();
        if (cls.indexOf("compare") !== -1 || cls.indexOf("crossed") !== -1 || cls.indexOf("old") !== -1 || cls.indexOf("original") !== -1) {
          continue;
        }
        var txt = el.textContent || el.innerText || "";
        if (!txt) continue;

        var matches = txt.match(/\$?\s*([0-9]{1,3}(?:[\.\,][0-9]{3})*(?:[\.\,][0-9]{2})?|[0-9]+)/g);
        if (matches && matches.length > 0) {
          for (var m = 0; m < matches.length; m++) {
            var cleaned = matches[m].replace(/[^0-9,\.]/g, "");
            if (cleaned) {
              var parsed = parseMoneyValue(cleaned);
              var norm = normalizeToPesos(parsed);
              if (norm > 0) return norm;
            }
          }
        }
      }
    }
    return 0;
  }

  currentPrice = detectProductPrice();

  function formatMoney(val) {
    var str = Math.round(val).toString();
    var res = ""; var count = 0;
    for (var i = str.length - 1; i >= 0; i--) {
      count++; res = str.charAt(i) + res;
      if (count % 3 === 0 && i !== 0) res = "." + res;
    }
    return "$" + res;
  }

  function buildInnerHtml(price) {
    var displayText = "";
    if (price > 0 && (minAmount <= 0 || price >= minAmount)) {
      var cuotaVal = price / cuotas;
      var formattedCuota = formatMoney(cuotaVal);
      displayText = msgCalculated
        .replace(/\$\s*\{\{?monto_cuota\}\}?/gi, formattedCuota)
        .replace(/\{\{?monto_cuota\}\}?/gi, formattedCuota)
        .replace(/\{\{?cuotas\}\}?/gi, cuotas);
      displayText = displayText.replace(/\$\s*\$/g, "$");
    } else {
      displayText = msgDefault
        .replace(/\{\{?cuotas\}\}?/gi, cuotas);
    }

    var iconHtml = iconType === "emoji"
      ? '<span style="font-size:18px !important;line-height:1 !important;display:inline-block !important;">' + emojiIcon + '</span>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="' + accentColor + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block !important;flex-shrink:0 !important;"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>';

    return '<div style="display:flex !important;align-items:center !important;justify-content:center !important;gap:10px !important;width:100% !important;max-width:1100px !important;margin:0 auto !important;box-sizing:border-box !important;">' +
      '<div style="display:flex !important;align-items:center !important;flex-shrink:0 !important;">' + iconHtml + '</div>' +
      '<div style="font-size:' + (size === "small" ? "11.5px" : (size === "large" ? "14px" : "12.5px")) + ' !important;font-weight:800 !important;line-height:1.25 !important;text-align:center !important;color:' + textColor + ' !important;overflow:hidden !important;text-overflow:ellipsis !important;white-space:normal !important;">' + displayText + '</div>' +
    '</div>';
  }

  var styleId = "style-" + idBase;
  if (!document.getElementById(styleId)) {
    var padCss = size === "small" ? "6px 12px" : (size === "large" ? "12px 18px" : "9px 14px");
    var bgCss = template === "oscura" ? "#000000" : (template === "neon" ? "#090D16" : bgColor);
    var borderCss = template === "neon" ? "1.5px solid " + accentColor : customBorder;
    var radiusCss = template === "flotante" ? "999px" : (template === "moderna" ? "10px" : "0px");
    var shadowCss = template === "neon" ? "box-shadow: 0 0 12px " + accentColor + "60 !important;" : customShadow;

    var deskTopCss = (desktopPos === "top") ? "top:0 !important;bottom:auto !important;" : "bottom:0 !important;top:auto !important;";

    var cssText = "";

    cssText += "#" + idSticky + ", #" + idProd + ", #" + idCart + " { " +
      "background: " + bgCss + " !important; border: " + borderCss + " !important; border-radius: " + radiusCss + " !important; " +
      "padding: " + padCss + " !important; color: " + textColor + " !important; box-sizing: border-box !important; " +
      "font-family: system-ui, -apple-system, sans-serif !important; " + shadowCss +
      "height: auto !important; min-height: 0 !important; max-height: 70px !important; overflow: hidden !important; " +
      "width: 100% !important; margin: 0 !important; " +
    "} ";

    cssText += "@media (min-width: 769px) { " +
      "html body #" + idSticky + " { " +
        "position: fixed !important; left: 0 !important; right: 0 !important; " +
        deskTopCss +
        "z-index: 999997 !important; display: block !important; " +
      "} ";

    if (template === "flotante") {
      cssText += "html body #" + idSticky + " { " +
        "width: calc(100% - 24px) !important; max-width: 1100px !important; " +
        "left: 0 !important; right: 0 !important; " +
        (desktopPos === "top" ? "margin: 8px auto 0 auto !important; top: 0 !important; bottom: auto !important; " : "margin: 0 auto 8px auto !important; bottom: 0 !important; top: auto !important; ") +
      "} ";
    }
    cssText += "} ";

    cssText += "@media (max-width: 768px) { ";
    if (mobilePos === "hide") {
      cssText += "html body #" + idSticky + " { display: none !important; } ";
    } else {
      var mobileFinalPos = deskTopCss;
      if (mobilePos === "top") mobileFinalPos = "top: 0 !important; bottom: auto !important;";
      else if (mobilePos === "bottom") mobileFinalPos = "bottom: 0 !important; top: auto !important;";

      cssText += "html body #" + idSticky + " { " +
        "position: fixed !important; left: 0 !important; right: 0 !important; " +
        mobileFinalPos +
        "z-index: 999997 !important; display: block !important; " +
      "} ";

      if (template === "flotante") {
        cssText += "html body #" + idSticky + " { " +
          "width: calc(100% - 16px) !important; left: 0 !important; right: 0 !important; " +
          (mobilePos === "bottom" ? "margin: 0 auto 6px auto !important;" : "margin: 6px auto 0 auto !important;") +
        "} ";
      }
    }
    cssText += "} ";

    cssText += "body.js-cart-slide-open #" + idSticky + ", body.js-modal-open #" + idSticky + ", .cart-active #" + idSticky + " { display: none !important; } ";

    var styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.type = "text/css";
    styleEl.setAttribute("data-nvx", "cuotasbar");
    styleEl.appendChild(document.createTextNode(cssText));
    (document.head || document.documentElement).appendChild(styleEl);
  }

  function findProductTarget() {
    var buySelectors = [
      "form[action*='/cart/add']",
      "form.js-product-form",
      ".js-product-buy-container",
      ".product-buy-container",
      "form.js-product-buyform",
      ".js-add-to-cart-btn",
      "#product_form"
    ];
    for (var sIdx = 0; sIdx < buySelectors.length; sIdx++) {
      var bEl = document.querySelector(buySelectors[sIdx]);
      if (bEl) return bEl;
    }
    return null;
  }

  function adjustStackingPosition() {
    var stEl = document.getElementById(idSticky);
    if (!stEl) return;

    var shipbarEl = document.querySelector(".nvx-shipbar-sticky");
    if (shipbarEl && shipbarEl.offsetHeight > 0) {
      var shipH = shipbarEl.offsetHeight;
      if (desktopPos === "top") {
        stEl.style.top = shipH + "px";
      } else {
        stEl.style.bottom = shipH + "px";
      }
    } else {
      if (desktopPos === "top") {
        stEl.style.top = "0px";
      } else {
        stEl.style.bottom = "0px";
      }
    }
  }

  function injectSticky() {
    if (!document.getElementById(idSticky)) {
      var container = document.createElement("div");
      container.id = idSticky;
      container.className = "nvx-widget nvx-cuotasbar-sticky";
      container.innerHTML = buildInnerHtml(currentPrice);
      if (document.body) document.body.appendChild(container);
    }
    adjustStackingPosition();
  }

  function injectProductBanner(isProductPageLocal) {
    if (!inProductBanner || !isProductPageLocal) return;
    if (!document.getElementById(idProd)) {
      var target = findProductTarget();
      if (target && target.parentNode) {
        var container = document.createElement("div");
        container.id = idProd;
        container.className = "nvx-widget nvx-cuotasbar-product";
        container.style.cssText = "margin: 12px 0 !important; width: 100% !important; max-height: 80px !important; overflow: hidden !important; display: block !important; box-sizing: border-box !important;";
        container.innerHTML = buildInnerHtml(currentPrice);
        target.parentNode.insertBefore(container, target.nextSibling);
      }
    }
  }

  function injectCartDrawer() {
    if (!inCartDrawer) return;
    if (!document.getElementById(idCart)) {
      var cartContainer = document.querySelector(".js-cart-panel, #cart-slide, .js-modal-cart, .cart-slide, .cart-summary, .js-cart-content, #shopping-cart");
      if (cartContainer) {
        var insertPoint = cartContainer.querySelector(".js-ajax-cart-list, .cart-body, .cart-table, .cart-row");
        if (insertPoint && insertPoint.parentNode) {
          var container = document.createElement("div");
          container.id = idCart;
          container.className = "nvx-widget nvx-cuotasbar-cart";
          container.style.cssText = "margin: 10px auto 0 !important; width: 94% !important; max-height: 80px !important; overflow: hidden !important; display: block !important; box-sizing: border-box !important;";
          container.innerHTML = buildInnerHtml(currentPrice);
          insertPoint.parentNode.insertBefore(container, insertPoint);
        }
      }
    }
  }

  function updateRenderedBars() {
    var cSticky = document.getElementById(idSticky);
    var cProd = document.getElementById(idProd);
    var cCart = document.getElementById(idCart);

    if (cSticky) cSticky.innerHTML = buildInnerHtml(currentPrice);
    if (cProd) cProd.innerHTML = buildInnerHtml(currentPrice);
    if (cCart) cCart.innerHTML = buildInnerHtml(currentPrice);
  }

  function syncEngine() {
    var isProdPage = (typeof detectPageType === "function" ? detectPageType() : "") === "product";
    currentPrice = detectProductPrice();

    var shouldShowStickyThisPage = stickyGlobal;
    if (isProdPage && inProductBanner) {
      shouldShowStickyThisPage = false;
    }

    if (shouldShowStickyThisPage) {
      injectSticky();
    } else {
      var cStickyNow = document.getElementById(idSticky);
      if (cStickyNow && cStickyNow.parentNode) {
        cStickyNow.parentNode.removeChild(cStickyNow);
      }
    }

    if (inProductBanner && isProdPage) {
      injectProductBanner(true);
    } else {
      var cProd = document.getElementById(idProd);
      if (cProd && cProd.parentNode) {
        cProd.parentNode.removeChild(cProd);
      }
    }

    if (inCartDrawer) {
      injectCartDrawer();
    }

    updateRenderedBars();
  }

  syncEngine();
  setInterval(syncEngine, 1000);

  // Reaccionar a selección de variantes de Tiendanube
  document.addEventListener("change", function(e) {
    if (e && e.target && (e.target.tagName === "SELECT" || e.target.type === "radio")) {
      setTimeout(syncEngine, 200);
      setTimeout(syncEngine, 600);
    }
  });

  if (typeof nvxTrack === "function") {
    nvxTrack(w.id, "impression");
  }
    }
/* ═══════════════════════════════════════════
   WIDGET #9: PRODUCTOS COMPLEMENTARIOS (v175 - Sin error 404 / Reload Suave)
   ═══════════════════════════════════════════ */
function renderProductosComplementarios(w) {
  var elementId = "nvx-cross-sell-" + w.id;
  if (document.getElementById(elementId)) return;

  var currentPage = typeof detectPageType === "function" ? detectPageType() : "";
  if (currentPage !== "product") return;

  var cfg = w.config || {};
  var title = cfg.title !== undefined ? cfg.title : "También te puede interesar";
  var subtitle = cfg.subtitle || "";
  var aiAutocomplete = cfg.aiAutocomplete !== false;
  var selectedProducts = Array.isArray(cfg.selectedProducts) ? cfg.selectedProducts : [];
  var maxProducts = parseInt(cfg.maxProducts, 10) || 3;
  if (maxProducts < 1) maxProducts = 1;
  if (maxProducts > 8) maxProducts = 8;
  var showDiscountBadge = cfg.showDiscountBadge !== false;
  var discountText = cfg.discountText || "-15% OFF";
  var inProductBanner = cfg.inProductBanner !== false;
  var openCartOnAdd = cfg.openCartOnAdd !== false;
  var position = cfg.position || "before_desc";

  var bgColor = cfg.bgColor || "#ffffff";
  var buttonBg = cfg.buttonBg || "#111827";
  var textColor = cfg.textColor || "#111827";

  var buttonText = "Agregar al carrito";
  if (cfg.buttonText && typeof cfg.buttonText === "string") {
    var txt = cfg.buttonText.trim();
    if (txt.indexOf("#") !== 0 && txt.length > 1) {
      buttonText = txt;
    }
  }

  var buttonTextColor = "#ffffff";
  if (cfg.buttonTextColor && typeof cfg.buttonTextColor === "string" && cfg.buttonTextColor.indexOf("#") === 0) {
    buttonTextColor = cfg.buttonTextColor;
  }

  var THEMES = {
    "black-friday": { bg: "#111827", btnBg: "#F59E0B", btnTx: "#111827", text: "#ffffff", border: "1px solid #374151" },
    "hot-sale": { bg: "#0F172A", btnBg: "#EF4444", btnTx: "#ffffff", text: "#ffffff", border: "1px solid #1E293B" },
    "cyber-monday": { bg: "#090D16", btnBg: "#3B82F6", btnTx: "#ffffff", text: "#ffffff", border: "1px solid #1E3A8A" },
    "navidad": { bg: "#064E3B", btnBg: "#EF4444", btnTx: "#ffffff", text: "#ffffff", border: "1px solid #047857" },
    "san-valentin": { bg: "#fff1f2", btnBg: "#F43F5E", btnTx: "#ffffff", text: "#831843", border: "1px solid #fecdd3" },
    "dia-padre-madre": { bg: "#EEF2FF", btnBg: "#312E81", btnTx: "#ffffff", text: "#312E81", border: "1px solid #c7d2fe" },
    "liquidacion": { bg: "#FEF2F2", btnBg: "#FBBF24", btnTx: "#7F1D1D", text: "#7F1D1D", border: "1px solid #fecaca" }
  };

  var customBorder = "1px solid #e5e7eb";
  if (cfg.campaignTheme && cfg.campaignTheme !== "none" && THEMES[cfg.campaignTheme]) {
    var tm = THEMES[cfg.campaignTheme];
    bgColor = tm.bg;
    buttonBg = tm.btnBg;
    buttonTextColor = tm.btnTx;
    textColor = tm.text;
    customBorder = tm.border;
  }

  function formatMoney(val) {
    var str = Math.round(val).toString();
    var res = "";
    var count = 0;
    for (var i = str.length - 1; i >= 0; i--) {
      count++;
      res = str.charAt(i) + res;
      if (count % 3 === 0 && i !== 0) res = "." + res;
    }
    return "$" + res;
  }

  function buildListHtml(products) {
    if (!products || products.length === 0) return "";

    var html = "";
    if (title) {
      html += '<div style="font-size:15px !important;font-weight:800 !important;margin-bottom:' + (subtitle ? "2px" : "12px") + ' !important;color:' + textColor + ' !important;">' + title + '</div>';
    }
    if (subtitle) {
      html += '<div style="font-size:12px !important;opacity:0.8 !important;margin-bottom:12px !important;color:' + textColor + ' !important;">' + subtitle + '</div>';
    }

    html += '<div style="display:flex !important;flex-direction:column !important;gap:10px !important;">';

    for (var i = 0; i < products.length; i++) {
      var item = products[i];
      var pVal = parseFloat(item.price) || 0;
      var pStr = formatMoney(pVal);

      var imgHtml = item.image
        ? '<img src="' + item.image + '" alt="" style="width:48px !important;height:48px !important;border-radius:8px !important;object-fit:cover !important;flex-shrink:0 !important;" />'
        : '<div style="width:48px !important;height:48px !important;border-radius:8px !important;background:rgba(156,163,175,0.2) !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-shrink:0 !important;"><svg width="20" height="20" fill="none" stroke="currentColor" opacity="0.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>';

      var badgeHtml = showDiscountBadge
        ? '<span style="background:rgba(16,185,129,0.15) !important;color:#10B981 !important;border:1px solid rgba(16,185,129,0.3) !important;font-size:10px !important;font-weight:800 !important;padding:1px 5px !important;border-radius:4px !important;display:inline-block !important;margin-top:2px !important;">' + discountText + '</span>'
        : "";

      html +=
        '<div style="display:flex !important;align-items:center !important;gap:10px !important;background:rgba(255,255,255,0.05) !important;border:1px solid rgba(156,163,175,0.2) !important;border-radius:12px !important;padding:8px 12px !important;width:100% !important;box-sizing:border-box !important;">' +
        imgHtml +
        '<div style="flex:1 !important;min-width:0 !important;">' +
        '<div style="font-size:13px !important;font-weight:700 !important;white-space:nowrap !important;overflow:hidden !important;text-overflow:ellipsis !important;color:' + textColor + ' !important;">' + (item.title || "Producto") + '</div>' +
        '<div style="display:flex !important;align-items:center !important;gap:6px !important;margin-top:2px !important;">' +
        '<span style="font-size:13px !important;font-weight:800 !important;color:' + textColor + ' !important;">' + pStr + '</span>' +
        '</div>' +
        badgeHtml +
        '</div>' +
        '<button type="button" data-nvx-idx="' + i + '" class="nvx-btn-add-cross" style="background:' + buttonBg + ' !important;color:' + buttonTextColor + ' !important;padding:8px 14px !important;border-radius:8px !important;font-size:12px !important;font-weight:800 !important;border:none !important;cursor:pointer !important;flex-shrink:0 !important;white-space:nowrap !important;transition:all 0.2s ease !important;">' + buttonText + '</button>' +
        '</div>';
    }

    html += '</div>';
    return html;
  }

  function openCartDrawer() {
    var cartTriggers = [
      ".js-toggle-cart",
      ".js-modal-open[data-target='#modal-cart']",
      ".js-modal-open[data-target='#cart-modal']",
      ".js-cart-notification",
      ".js-ajax-cart-open",
      ".js-cart-modal",
      "#cart-button",
      ".cart-btn",
      "[data-component='cart.toggle']",
      ".js-open-cart",
      ".js-cart-summary"
    ];
    for (var c = 0; c < cartTriggers.length; c++) {
      var trig = document.querySelector(cartTriggers[c]);
      if (trig && trig.offsetParent !== null) {
        try {
          trig.click();
          return true;
        } catch (e) {}
      }
    }
    return false;
  }

  function handleAddOnlyComplementary(item, btnEl) {
    if (!item) return;

    var productId = item.id;
    var variantId = item.variantId || item.variant_id || (item.variants && item.variants[0] ? item.variants[0].id : null) || productId;

    var defaultLabel = buttonText || "Agregar al carrito";

    if (btnEl) {
      btnEl.innerText = "Agregando...";
      btnEl.style.opacity = "0.7";
      btnEl.disabled = true;
    }

    function markSuccess() {
      if (btnEl) {
        btnEl.innerText = "¡Agregado al carrito! ✓";
        btnEl.style.opacity = "1";
      }

      setTimeout(function () {
        if (btnEl) {
          btnEl.innerText = defaultLabel;
          btnEl.disabled = false;
        }
      }, 2500);
    }

    function markError() {
      if (btnEl) {
        btnEl.innerText = defaultLabel;
        btnEl.style.opacity = "1";
        btnEl.disabled = false;
      }
    }

    // 🚀 RUTA 1: VÍA OFICIAL NUBESDK
    if (typeof window !== "undefined" && window.nube && typeof window.nube.send === "function") {
      try {
        window.nube.send("cart:add", function () {
          return {
            cart: {
              items: [{ product_id: Number(productId), variant_id: Number(variantId), quantity: 1 }]
            }
          };
        });

        markSuccess();

        if (openCartOnAdd) {
          setTimeout(function () {
            try {
              window.nube.send("cart:open");
            } catch (eOpen) {
              var openedNube = openCartDrawer();
              if (!openedNube) {
                window.location.reload();
              }
            }
          }, 300);
        }
        return;
      } catch (errNube) {
        console.warn("[Nevux] Error en NubeSDK, usando fallback /comprar/:", errNube);
      }
    }

    // 🔄 RUTA 2: FALLBACK CLÁSICO CON FORM DATA A /comprar/
    try {
      var formData = new FormData();
      formData.append("add_to_cart", String(productId));
      if (variantId) {
        formData.append("variant_id", String(variantId));
      }
      formData.append("quantity", "1");

      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/comprar/", true);
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xhr.withCredentials = true;

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 400) {
            markSuccess();
            if (openCartOnAdd) {
              var opened = openCartDrawer();
              if (!opened) {
                setTimeout(function () {
                  window.location.reload();
                }, 400);
              }
            }
          } else {
            markError();
          }
        }
      };
      xhr.send(formData);
    } catch (errXhr) {
      markError();
    }
  }

  function bindButtons(root, products) {
    if (!root) return;
    var btns = root.querySelectorAll(".nvx-btn-add-cross");
    for (var b = 0; b < btns.length; b++) {
      btns[b].addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var idx = parseInt(this.getAttribute("data-nvx-idx"), 10);
        var targetProduct = products[idx];
        handleAddOnlyComplementary(targetProduct, this);
      });
    }
  }

  function resolveVariantsMapAndInject(products) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "/products.json", true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              var data = JSON.parse(xhr.responseText);
              var items = Array.isArray(data) ? data : (data.products || []);
              var vMap = {};
              for (var j = 0; j < items.length; j++) {
                if (items[j] && items[j].id && items[j].variants && items[j].variants[0]) {
                  vMap[String(items[j].id)] = items[j].variants[0].id;
                }
              }
              for (var k = 0; k < products.length; k++) {
                var p = products[k];
                if (!p.variantId || String(p.variantId) === String(p.id)) {
                  if (vMap[String(p.id)]) {
                    products[k].variantId = vMap[String(p.id)];
                  }
                }
              }
            } catch (eP) {}
          }
          injectIntoPage(products);
        }
      };
      xhr.send();
    } catch (eX) {
      injectIntoPage(products);
    }
  }

  function injectIntoPage(products) {
    if (!inProductBanner) return;
    if (document.getElementById(elementId)) return;
    if (!products || products.length === 0) return;

    var styleId = "style-" + elementId;
    if (!document.getElementById(styleId)) {
      var styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.type = "text/css";
      var css =
        "#" + elementId + " { " +
        "background: " + bgColor + " !important; " +
        "border: " + customBorder + " !important; " +
        "border-radius: 16px !important; " +
        "padding: 16px !important; " +
        "color: " + textColor + " !important; " +
        "box-sizing: border-box !important; " +
        "box-shadow: 0 4px 14px rgba(0,0,0,0.05) !important; " +
        "display: flex !important; " +
        "flex-direction: column !important; " +
        "gap: 12px !important; " +
        "margin: 14px 0 !important; " +
        "width: 100% !important; " +
        "font-family: system-ui, -apple-system, sans-serif !important; " +
        "} ";
      styleEl.appendChild(document.createTextNode(css));
      document.head.appendChild(styleEl);
    }

    var container = document.createElement("div");
    container.id = elementId;
    container.className = "nvx-widget nvx-cross-sell-wrapper";
    container.innerHTML = buildListHtml(products);

    var targetEl = null;

    if (position === "after_desc") {
      var descSelectors = [
        ".js-product-description",
        ".product-description",
        "#product-description",
        ".product-detail-description",
        "[data-component='product.description']",
        ".user-content"
      ];
      for (var dIdx = 0; dIdx < descSelectors.length; dIdx++) {
        var dEl = document.querySelector(descSelectors[dIdx]);
        if (dEl) { targetEl = dEl; break; }
      }
      if (targetEl && targetEl.parentNode) {
        targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
      }
    }

    if (!container.parentNode) {
      var buySelectors = [
        "form[action*='/cart/add']",
        "form.js-product-form",
        ".js-product-buy-container",
        ".product-buy-container",
        "form.js-product-buyform",
        ".js-add-to-cart-btn",
        "#product_form"
      ];
      for (var sIdx = 0; sIdx < buySelectors.length; sIdx++) {
        var bEl = document.querySelector(buySelectors[sIdx]);
        if (bEl) { targetEl = bEl; break; }
      }
      if (targetEl && targetEl.parentNode) {
        if (position === "before_cart") {
          targetEl.parentNode.insertBefore(container, targetEl);
        } else {
          targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
        }
      } else {
        var main = document.querySelector("main, #content, .main-content, .js-product-container");
        if (main) main.insertBefore(container, main.firstChild);
      }
    }

    if (container.parentNode) {
      bindButtons(container, products);
    }
  }

  var productsToShow = [];
  if (selectedProducts.length > 0) {
    productsToShow = selectedProducts.slice(0, maxProducts);
    resolveVariantsMapAndInject(productsToShow);
  } else if (aiAutocomplete) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "/products.json", true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          try {
            var data = JSON.parse(xhr.responseText);
            var items = Array.isArray(data) ? data : (data.products || []);
            var currentId = window.LS && window.LS.product ? window.LS.product.id : null;
            var fetched = [];
            for (var i = 0; i < items.length; i++) {
              if (items[i].id !== currentId && items[i].variants && items[i].variants[0]) {
                var nm = items[i].name;
                var titleP = typeof nm === "object" && nm ? (nm.es || nm.pt || nm.en || "Producto") : (nm || "Producto");
                fetched.push({
                  id: items[i].id,
                  variantId: items[i].variants[0].id,
                  title: titleP,
                  price: items[i].variants[0].price,
                  image: items[i].images && items[i].images[0] ? items[i].images[0].src : "",
                  url: items[i].url || "#"
                });
              }
              if (fetched.length >= maxProducts) break;
            }
            if (fetched.length > 0) injectIntoPage(fetched.slice(0, maxProducts));
          } catch (e) {}
        }
      };
      xhr.send();
    } catch (e2) {}
  }

  if (typeof nvxTrack === "function") {
    nvxTrack(w.id, "impression");
  }
    }
          /* ═══════════════════════════════════════════
     RENDER: BUNDLE DE CANTIDAD (v207 — precios + complementarios al carrito)
  ═══════════════════════════════════════════ */
  function renderBundleCantidad(w) {
    if (!w || !w.config) return;

    var elementId = "nvx-bundle-cantidad-" + w.id;
    if (document.getElementById(elementId)) return;

    var currentPage = typeof detectPageType === "function" ? detectPageType() : "";
    if (currentPage !== "product") return;

    var cfg = w.config || {};

    var title = cfg.title || "";
    var bgColor = cfg.bgColor || "#ffffff";
    var textColor = cfg.textColor || "#111827";
    var borderColor = cfg.borderColor || "#e5e7eb";
    var accentColor = cfg.accentColor || "#10B981";
    var selectedBorderColor = cfg.selectedBorderColor || "#111827";
    var buttonBg = cfg.buttonBg || "#111827";
    var buttonTextColor = cfg.buttonTextColor || "#ffffff";
    var buttonText = cfg.buttonText || "Agregar al carrito";
    var borderRadius = (cfg.borderRadius || 12) + "px";
    var replaceCart = cfg.replaceCartButton !== false;
    var labelStyle = cfg.labelStyle || "lleva";
    var priceMode = cfg.priceMode || "total";
    var showSavings = cfg.showSavingsBadge !== false;
    var savingsBadgeText = cfg.savingsBadgeText || "AHORRÁS $X";
    var savingsBadgeBg = cfg.savingsBadgeBg || "#059669";
    var savingsBadgeTextColor = cfg.savingsBadgeTextColor || "#ffffff";
    var maxUnits = cfg.maxUnits || 3;
    var redirectCheckout = cfg.redirectToCheckout === true;

    var THEMES = {
      "black-friday": { bg: "#111827", text: "#ffffff", border: "#374151", accent: "#F59E0B", btn: "#F59E0B", btnText: "#111827" },
      "hot-sale": { bg: "#0F172A", text: "#ffffff", border: "#1e293b", accent: "#EF4444", btn: "#EF4444", btnText: "#ffffff" },
      "cyber-monday": { bg: "#090D16", text: "#ffffff", border: "#1e3a5f", accent: "#3B82F6", btn: "#3B82F6", btnText: "#ffffff" },
      "navidad": { bg: "#064E3B", text: "#ffffff", border: "#047857", accent: "#EF4444", btn: "#EF4444", btnText: "#ffffff" },
      "san-valentin": { bg: "#831843", text: "#ffffff", border: "#9d174d", accent: "#F43F5E", btn: "#F43F5E", btnText: "#ffffff" },
      "dia-padre-madre": { bg: "#312E81", text: "#ffffff", border: "#4338ca", accent: "#10B981", btn: "#10B981", btnText: "#ffffff" },
      "liquidacion": { bg: "#7F1D1D", text: "#ffffff", border: "#991b1b", accent: "#FBBF24", btn: "#FBBF24", btnText: "#7F1D1D" }
    };
    if (cfg.campaignTheme && cfg.campaignTheme !== "none" && THEMES[cfg.campaignTheme]) {
      var th = THEMES[cfg.campaignTheme];
      bgColor = th.bg;
      textColor = th.text;
      borderColor = th.border;
      accentColor = th.accent;
      selectedBorderColor = th.accent;
      buttonBg = th.btn;
      buttonTextColor = th.btnText;
      savingsBadgeBg = th.accent;
    }

    var unitPrice = 0;
    if (typeof window.nvxBundleGetProductPrice === "function") {
      unitPrice = window.nvxBundleGetProductPrice();
    } else {
      var priceEl = document.querySelector(".js-price-display, #price_display, .js-product-price, .product-price, .price-display");
      if (priceEl) {
        var rawTxt = priceEl.innerText || priceEl.textContent || "";
        var cleaned = String(rawTxt).replace(/[^0-9.,]/g, "").replace(/\./g, "").replace(",", ".");
        unitPrice = parseFloat(cleaned) || 0;
      }
    }

    var rawUnits = (cfg.units && cfg.units.length) ? cfg.units : [
      { qty: 1, subtitle: "", discountPercent: 0, defaultSelected: true, badgeEnvioGratis: false, badgeMasVendido: false, badgePersonalizado: false, badgePersonalizadoText: "", hidden: false },
      { qty: 2, subtitle: "Ahorrá 10%", discountPercent: 10, defaultSelected: false, badgeEnvioGratis: false, badgeMasVendido: true, badgePersonalizado: false, badgePersonalizadoText: "", hidden: false },
      { qty: 3, subtitle: "Ahorrá más", discountPercent: 15, defaultSelected: false, badgeEnvioGratis: true, badgeMasVendido: false, badgePersonalizado: false, badgePersonalizadoText: "", hidden: false }
    ];
    var visibleUnits = [];
    for (var u = 0; u < rawUnits.length; u++) {
      if (!rawUnits[u].hidden && visibleUnits.length < maxUnits) {
        visibleUnits.push(rawUnits[u]);
      }
    }
    if (visibleUnits.length === 0) return;

    var prodId = "";
    if (window.LS && window.LS.product && window.LS.product.id) {
      prodId = String(window.LS.product.id);
    } else if (window.LS && window.LS.product_id) {
      prodId = String(window.LS.product_id);
    } else if (w.target_product_id) {
      prodId = String(w.target_product_id);
    }

    var safeEsc = function (str) {
      if (!str) return "";
      return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    };
    var fmtMoney = function (num) {
      if (typeof window.nvxBundleFormatPrice === "function") {
        return window.nvxBundleFormatPrice(num);
      }
      var n = Math.round(Number(num) || 0);
      var s = String(n);
      var out = "";
      var c = 0;
      for (var i = s.length - 1; i >= 0; i--) {
        out = s.charAt(i) + out;
        c++;
        if (c === 3 && i > 0) { out = "." + out; c = 0; }
      }
      return "$" + out;
    };

    var styleId = "style-" + elementId;
    if (!document.getElementById(styleId)) {
      var styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.type = "text/css";
      var css =
        "#" + elementId + " {" +
          "background:" + bgColor + " !important;" +
          "border:1.5px solid " + borderColor + " !important;" +
          "border-radius:" + borderRadius + " !important;" +
          "padding:16px !important;" +
          "color:" + textColor + " !important;" +
          "box-sizing:border-box !important;" +
          "box-shadow:0 4px 14px rgba(0,0,0,0.05) !important;" +
          "display:flex !important;" +
          "flex-direction:column !important;" +
          "gap:10px !important;" +
          "margin:14px 0 !important;" +
          "width:100% !important;" +
          "font-family:system-ui,-apple-system,sans-serif !important;" +
        "}" +
        "#" + elementId + " .nvx-bc-card {" +
          "border-radius:10px !important;" +
          "padding:12px 14px !important;" +
          "border:2px solid " + borderColor + " !important;" +
          "display:flex !important;" +
          "align-items:center !important;" +
          "justify-content:space-between !important;" +
          "cursor:pointer !important;" +
          "transition:all 0.2s !important;" +
          "background:transparent !important;" +
          "user-select:none !important;" +
        "}" +
        "#" + elementId + " .nvx-bc-card.selected {" +
          "border-color:" + selectedBorderColor + " !important;" +
          "background:rgba(16,185,129,0.06) !important;" +
        "}" +
        "#" + elementId + " .nvx-bc-radio {" +
          "width:18px !important;height:18px !important;border-radius:50% !important;" +
          "border:2px solid #d1d5db !important;flex-shrink:0 !important;" +
          "background:#fff !important;box-sizing:border-box !important;" +
        "}" +
        "#" + elementId + " .nvx-bc-card.selected .nvx-bc-radio {" +
          "border:6px solid " + accentColor + " !important;" +
        "}" +
        "#" + elementId + " .nvx-bc-btn {" +
          "width:100% !important;background:" + buttonBg + " !important;color:" + buttonTextColor + " !important;" +
          "border:none !important;border-radius:999px !important;padding:14px !important;" +
          "font-size:15px !important;font-weight:800 !important;cursor:pointer !important;" +
          "margin-top:6px !important;box-shadow:0 2px 8px rgba(0,0,0,0.1) !important;" +
        "}" +
        "#" + elementId + " .nvx-bc-btn:active { transform:scale(0.98) !important; }" +
        "#" + elementId + " .nvx-bc-comp-row {" +
          "display:flex !important;align-items:center !important;gap:8px !important;" +
          "margin-bottom:8px !important;cursor:pointer !important;" +
        "}" +
        "#" + elementId + " .nvx-bc-grand-total {" +
          "font-size:13px !important;font-weight:700 !important;text-align:right !important;" +
          "color:" + textColor + " !important;" +
        "}" +
        "#" + elementId + " .nvx-bc-grand-total strong {" +
          "color:" + accentColor + " !important;font-weight:900 !important;" +
        "}";
      styleEl.appendChild(document.createTextNode(css));
      document.head.appendChild(styleEl);
    }

    var hasDefault = false;
    for (var d = 0; d < visibleUnits.length; d++) {
      if (visibleUnits[d].defaultSelected) { hasDefault = true; break; }
    }

    var html = "";
    if (title) {
      html += '<div style="font-size:16px !important;font-weight:800 !important;color:' + textColor + ' !important;">' + safeEsc(title) + '</div>';
    }

    html += '<div style="display:flex !important;flex-direction:column !important;gap:8px !important;width:100% !important;">';

    for (var i2 = 0; i2 < visibleUnits.length; i2++) {
      var un = visibleUnits[i2];
      var sel = un.defaultSelected || (!hasDefault && i2 === 0);
      var disc = un.discountPercent || 0;
      var qty = un.qty || (i2 + 1);
      var totalPrice = unitPrice > 0 ? unitPrice * qty * (1 - disc / 100) : 0;
      var showPrice = priceMode === "unit" && qty > 0 ? totalPrice / qty : totalPrice;

      var packLabel = "Pack x" + qty;
      if (labelStyle === "lleva") packLabel = "Lleva " + qty;
      if (labelStyle === "unidades") packLabel = qty + " unidad" + (qty > 1 ? "es" : "");

      html += '<div class="nvx-bc-card' + (sel ? " selected" : "") + '" data-qty="' + qty + '" data-price="' + totalPrice + '" onclick="window.nvxSelectBundleCantidad(this,\'' + elementId + '\');">';
      html += '<div style="display:flex !important;align-items:center !important;gap:10px !important;">';
      html += '<div class="nvx-bc-radio"></div>';
      html += '<div>';
      html += '<div style="font-size:14px !important;font-weight:800 !important;color:' + textColor + ' !important;">' + safeEsc(packLabel) + '</div>';
      if (un.subtitle) {
        html += '<div style="font-size:11px !important;opacity:0.7 !important;margin-top:2px !important;color:' + textColor + ' !important;">' + safeEsc(un.subtitle) + '</div>';
      }
      html += '<div style="display:flex !important;gap:4px !important;margin-top:4px !important;flex-wrap:wrap !important;">';
      if (un.badgeEnvioGratis) html += '<span style="font-size:9px !important;font-weight:800 !important;background:#10B981 !important;color:#fff !important;padding:2px 6px !important;border-radius:4px !important;">ENVÍO GRATIS</span>';
      if (un.badgeMasVendido) html += '<span style="font-size:9px !important;font-weight:800 !important;background:#EF4444 !important;color:#fff !important;padding:2px 6px !important;border-radius:4px !important;">MÁS VENDIDO</span>';
      if (un.badgePersonalizado && un.badgePersonalizadoText) html += '<span style="font-size:9px !important;font-weight:800 !important;background:#F59E0B !important;color:#fff !important;padding:2px 6px !important;border-radius:4px !important;">' + safeEsc(un.badgePersonalizadoText) + '</span>';
      html += '</div></div></div>';

      html += '<div style="text-align:right !important;">';
      if (disc > 0 && showSavings) {
        var bTxt = savingsBadgeText.replace("$X", disc + "%");
        html += '<div style="font-size:9px !important;font-weight:800 !important;background:' + savingsBadgeBg + ' !important;color:' + savingsBadgeTextColor + ' !important;padding:2px 6px !important;border-radius:4px !important;margin-bottom:4px !important;display:inline-block !important;">' + safeEsc(bTxt) + '</div>';
      }
      if (showPrice > 0) {
        html += '<div style="font-size:14px !important;font-weight:900 !important;color:' + accentColor + ' !important;">' + fmtMoney(showPrice) + '</div>';
      } else if (disc > 0) {
        html += '<div style="font-size:14px !important;font-weight:900 !important;color:' + accentColor + ' !important;">-' + disc + '%</div>';
      }
      html += '</div></div>';
    }
    html += '</div>';

    var comps = (cfg.complementary && cfg.complementary.length) ? cfg.complementary : [];
    var validComps = [];
    for (var c = 0; c < comps.length; c++) {
      if (comps[c] && comps[c].productId) validComps.push(comps[c]);
    }
    if (validComps.length > 0) {
      html += '<div style="margin-top:8px !important;padding-top:12px !important;border-top:1px solid ' + borderColor + ' !important;">';
      html += '<div style="font-size:12px !important;font-weight:700 !important;margin-bottom:8px !important;color:' + textColor + ' !important;opacity:0.85 !important;">Complementos sugeridos:</div>';
      for (var v = 0; v < validComps.length; v++) {
        var cp = validComps[v];
        var chk = cp.checkedByDefault ? " checked" : "";
        var cpPrice = parseFloat(cp.productPrice || cp.price || 0) || 0;
        html += '<label class="nvx-bc-comp-row">';
        html += '<input type="checkbox" class="nvx-bc-comp-chk" data-comp-id="' + cp.productId + '" data-comp-price="' + cpPrice + '"' + chk + ' style="width:16px !important;height:16px !important;accent-color:' + accentColor + ' !important;" onchange="if(window.nvxUpdateBundleCantidadTotal)window.nvxUpdateBundleCantidadTotal(\'' + elementId + '\');" />';
        if (cp.productImage) {
          html += '<img src="' + safeEsc(cp.productImage) + '" style="width:28px !important;height:28px !important;border-radius:4px !important;object-fit:cover !important;" />';
        }
        html += '<span style="font-size:12px !important;font-weight:600 !important;color:' + textColor + ' !important;flex:1 !important;">' + safeEsc(cp.productName || "") + '</span>';
        if (cpPrice > 0) {
          html += '<span style="font-size:12px !important;font-weight:800 !important;color:' + accentColor + ' !important;">' + fmtMoney(cpPrice) + '</span>';
        }
        html += '</label>';
      }
      html += '</div>';
    }

    html += '<div class="nvx-bc-grand-total">Total: <strong>—</strong></div>';
    html += '<button type="button" class="nvx-bc-btn" onclick="window.nvxSubmitBundleCantidad(this,\'' + elementId + '\',\'' + safeEsc(String(prodId)) + '\',' + (redirectCheckout ? "true" : "false") + ');">' + safeEsc(buttonText) + '</button>';

    var container = document.createElement("div");
    container.id = elementId;
    container.className = "nvx-widget nvx-bundle-cantidad-wrapper";
    container.setAttribute("data-btn-text", buttonText);
    container.innerHTML = html;

    var targetEl = null;
    var buySelectors = [
      "form[action*='/cart/add']",
      "form.js-product-form",
      ".js-product-buy-container",
      ".product-buy-container",
      "form.js-product-buyform",
      ".js-add-to-cart-btn",
      "#product_form",
      "form[action*='/cart']",
      "form[action*='/comprar']",
      ".product-form"
    ];
    for (var sIdx = 0; sIdx < buySelectors.length; sIdx++) {
      var bEl = document.querySelector(buySelectors[sIdx]);
      if (bEl) { targetEl = bEl; break; }
    }

    if (targetEl && targetEl.parentNode) {
      if (replaceCart) {
        targetEl.parentNode.insertBefore(container, targetEl);
        try { targetEl.style.display = "none"; } catch (eHide) {}
      } else {
        targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
      }
    } else {
      var main = document.querySelector("main, #content, .main-content, .js-product-container, .product-container, #single-product, .product");
      if (main) {
        main.appendChild(container);
      } else if (document.body) {
        document.body.appendChild(container);
      }
    }

    var initQty = 1;
    for (var iq = 0; iq < visibleUnits.length; iq++) {
      if (visibleUnits[iq].defaultSelected) { initQty = visibleUnits[iq].qty || 1; break; }
    }
    var qtyInputs = document.querySelectorAll('input.js-quantity-input, input[name="quantity"], input.quantity-input, #quantity, .js-prod-quantity');
    for (var qI = 0; qI < qtyInputs.length; qI++) {
      qtyInputs[qI].value = initQty;
    }

    setTimeout(function () {
      if (typeof window.nvxUpdateBundleCantidadTotal === "function") {
        window.nvxUpdateBundleCantidadTotal(elementId);
      }
    }, 50);

    if (typeof nvxTrack === "function") {
      nvxTrack(w.id, "impression");
    }
  }

  if (typeof window.nvxSelectBundleCantidad !== "function") {
    window.nvxSelectBundleCantidad = function (cardEl, elementId) {
      var root = document.getElementById(elementId);
      if (!root) return;
      var cards = root.getElementsByClassName("nvx-bc-card");
      for (var i = 0; i < cards.length; i++) {
        cards[i].className = String(cards[i].className).replace(/\s*selected/g, "");
      }
      cardEl.className = cardEl.className + " selected";

      var qty = parseInt(cardEl.getAttribute("data-qty") || "1", 10) || 1;
      var qtyInputs = document.querySelectorAll('input.js-quantity-input, input[name="quantity"], input.quantity-input, #quantity, .js-prod-quantity');
      for (var j = 0; j < qtyInputs.length; j++) {
        qtyInputs[j].value = qty;
        try {
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent("change", true, true);
          qtyInputs[j].dispatchEvent(evt);
        } catch (e) {}
      }

      if (typeof window.nvxUpdateBundleCantidadTotal === "function") {
        window.nvxUpdateBundleCantidadTotal(elementId);
      }
    };
  }

  if (typeof window.nvxUpdateBundleCantidadTotal !== "function") {
    window.nvxUpdateBundleCantidadTotal = function (elementId) {
      var root = document.getElementById(elementId);
      if (!root) return;

      var selected = root.querySelector(".nvx-bc-card.selected");
      var packPrice = selected ? (parseFloat(selected.getAttribute("data-price") || "0") || 0) : 0;

      var compTotal = 0;
      var compChks = root.querySelectorAll(".nvx-bc-comp-chk");
      for (var i = 0; i < compChks.length; i++) {
        if (compChks[i].checked) {
          compTotal += parseFloat(compChks[i].getAttribute("data-comp-price" || "0") || 0) || 0;
        }
      }

      var grand = packPrice + compTotal;
      var totalEl = root.querySelector(".nvx-bc-grand-total");
      var btn = root.querySelector(".nvx-bc-btn");
      var baseBtn = root.getAttribute("data-btn-text") || "Agregar al carrito";

      function fmt(n) {
        if (typeof window.nvxBundleFormatPrice === "function") return window.nvxBundleFormatPrice(n);
        var x = Math.round(Number(n) || 0);
        var s = String(x), out = "", c = 0;
        for (var i = s.length - 1; i >= 0; i--) {
          out = s.charAt(i) + out; c++;
          if (c === 3 && i > 0) { out = "." + out; c = 0; }
        }
        return "$" + out;
      }

      if (totalEl) {
        if (grand > 0) {
          totalEl.innerHTML = "Total: <strong>" + fmt(grand) + "</strong>" + (compTotal > 0 ? ' <span style="opacity:0.7;font-size:11px;">(pack + extras)</span>' : "");
        } else {
          totalEl.innerHTML = "Total: <strong>—</strong>";
        }
      }
      if (btn) {
        if (grand > 0) {
          btn.innerHTML = baseBtn + " · " + fmt(grand);
        } else {
          btn.innerHTML = baseBtn;
        }
      }
    };
  }

  if (typeof window.nvxSubmitBundleCantidad !== "function") {
    window.nvxSubmitBundleCantidad = function (btnEl, elementId, prodId, redirectCheckout) {
      var root = document.getElementById(elementId);
      if (!root) return;

      var origText = btnEl.getAttribute("data-orig-text") || btnEl.innerHTML;
      btnEl.setAttribute("data-orig-text", origText);
      btnEl.innerHTML = "Agregando...";
      btnEl.disabled = true;

      var selected = root.querySelector(".nvx-bc-card.selected");
      var qty = selected ? (parseInt(selected.getAttribute("data-qty") || "1", 10) || 1) : 1;

      var qtyInputs = document.querySelectorAll('input.js-quantity-input, input[name="quantity"], input.quantity-input, #quantity, .js-prod-quantity');
      for (var j = 0; j < qtyInputs.length; j++) {
        qtyInputs[j].value = qty;
        try {
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent("change", true, true);
          qtyInputs[j].dispatchEvent(evt);
        } catch (e) {}
      }

      var compChks = root.querySelectorAll(".nvx-bc-comp-chk");
      var compIds = [];
      for (var c = 0; c < compChks.length; c++) {
        if (compChks[c].checked) {
          var cid = compChks[c].getAttribute("data-comp-id");
          if (cid) compIds.push(String(cid));
        }
      }

      function restoreBtn() {
        btnEl.innerHTML = origText;
        btnEl.disabled = false;
      }

      function addViaNube(productId, quantity) {
        return new Promise(function (resolve) {
          try {
            if (window.nube && typeof window.nube.send === "function") {
              window.nube.send("cart:add", {
                product_id: productId,
                quantity: quantity
              });
              setTimeout(function () { resolve(true); }, 300);
              return;
            }
          } catch (e1) {}
          resolve(false);
        });
      }

      function addViaComprar(productId, quantity) {
        return new Promise(function (resolve) {
          try {
            var fd = new FormData();
            fd.append("add_to_cart", productId);
            fd.append("quantity", String(quantity));
            fetch("/comprar/", {
              method: "POST",
              body: fd,
              credentials: "include"
            }).then(function () { resolve(true); }).catch(function () { resolve(false); });
          } catch (e2) {
            resolve(false);
          }
        });
      }

      var hasNube = (typeof window !== "undefined" && window.nube && typeof window.nube.send === "function");

      if (hasNube) {
        addViaNube(prodId, qty).then(function () {
          var chain = Promise.resolve();
          for (var s = 0; s < compIds.length; s++) {
            (function (id) {
              chain = chain.then(function () { return addViaNube(id, 1); });
            })(compIds[s]);
          }
          return chain;
        }).then(function () {
          if (redirectCheckout) {
            window.location.href = "/comprar/";
          } else {
            try { window.nube.send("cart:open"); } catch (e3) {}
            restoreBtn();
          }
        });
        return;
      }

      // Sin NubeSDK: POST secuencial del pack + cada complementario, luego redirect o reload
      addViaComprar(prodId, qty).then(function () {
        var chain = Promise.resolve();
        for (var s2 = 0; s2 < compIds.length; s2++) {
          (function (id) {
            chain = chain.then(function () { return addViaComprar(id, 1); });
          })(compIds[s2]);
        }
        return chain;
      }).then(function () {
        if (redirectCheckout) {
          window.location.href = "/comprar/";
        } else {
          window.location.reload();
        }
      }).catch(function () {
        window.location.reload();
      });
    };
        }
  /* ═══════════════════════════════════════════
     RENDER: SLIDER DE VIDEOS (v208)
  ═══════════════════════════════════════════ */
  function renderSliderVideos(w) {
    if (!w || !w.config) return;

    var elementId = "nvx-slider-videos-" + w.id;
    if (document.getElementById(elementId)) return;

    var currentPage = typeof detectPageType === "function" ? detectPageType() : "";
    if (currentPage !== "product") return;

    var cfg = w.config || {};
    var videos = cfg.videos || [];
    if (!videos || videos.length === 0) return;

    var title = cfg.title || "";
    var subtitle = cfg.subtitle || "";
    var displayFormat = cfg.displayFormat || "slider";
    var position = cfg.position || "before-cart";
    var autoplay = cfg.autoplay || "muted";
    var bgColor = cfg.bgColor || "#ffffff";
    var textColor = cfg.textColor || "#111827";
    var accentColor = cfg.accentColor || "#10B981";
    var titleAlign = cfg.titleAlign || "center";
    var ctaText = cfg.ctaText || "Comprar ahora";
    var ctaBgColor = cfg.ctaBgColor || "#111827";
    var ctaTextColor = cfg.ctaTextColor || "#ffffff";
    var borderRadius = (cfg.borderRadius || 16) + "px";

    var safeEsc = function (str) {
      if (!str) return "";
      return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    };

    var styleId = "style-" + elementId;
    if (!document.getElementById(styleId)) {
      var styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.type = "text/css";
      var css =
        "#" + elementId + " {" +
          "background:" + bgColor + " !important;" +
          "border-radius:" + borderRadius + " !important;" +
          "padding:16px !important;" +
          "color:" + textColor + " !important;" +
          "box-sizing:border-box !important;" +
          "margin:16px 0 !important;" +
          "width:100% !important;" +
          "font-family:system-ui,-apple-system,sans-serif !important;" +
        "}" +
        "#" + elementId + " .nvx-sv-scroll {" +
          "display:flex !important;" +
          "gap:12px !important;" +
          "overflow-x:auto !important;" +
          "padding-bottom:8px !important;" +
          "-webkit-overflow-scrolling:touch !important;" +
          "scrollbar-width:none !important;" +
        "}" +
        "#" + elementId + " .nvx-sv-scroll::-webkit-scrollbar { display:none !important; }" +
        "#" + elementId + " .nvx-sv-card {" +
          "position:relative !important;" +
          "width:140px !important;" +
          "height:230px !important;" +
          "border-radius:12px !important;" +
          "overflow:hidden !important;" +
          "flex-shrink:0 !important;" +
          "background:#000000 !important;" +
          "cursor:pointer !important;" +
          "box-shadow:0 4px 10px rgba(0,0,0,0.1) !important;" +
        "}" +
        "#" + elementId + " .nvx-sv-circle-card {" +
          "display:flex !important;" +
          "flex-direction:column !important;" +
          "align-items:center !important;" +
          "gap:6px !important;" +
          "flex-shrink:0 !important;" +
          "cursor:pointer !important;" +
        "}" +
        "#" + elementId + " .nvx-sv-circle-ring {" +
          "width:68px !important;" +
          "height:68px !important;" +
          "border-radius:50% !important;" +
          "padding:3px !important;" +
          "background:linear-gradient(45deg, " + accentColor + ", #F59E0B) !important;" +
          "display:flex !important;" +
          "align-items:center !important;" +
          "justify-content:center !important;" +
          "box-sizing:border-box !important;" +
        "}" +
        "#" + elementId + " .nvx-sv-circle-img {" +
          "width:100% !important;" +
          "height:100% !important;" +
          "border-radius:50% !important;" +
          "object-fit:cover !important;" +
        "}";
      styleEl.appendChild(document.createTextNode(css));
      document.head.appendChild(styleEl);
    }

    var html = "";
    if (title) {
      html += '<div style="font-size:16px !important;font-weight:800 !important;text-align:' + titleAlign + ' !important;margin-bottom:4px !important;color:' + textColor + ' !important;">' + safeEsc(title) + '</div>';
    }
    if (subtitle) {
      html += '<div style="font-size:12px !important;opacity:0.8 !important;text-align:' + titleAlign + ' !important;margin-bottom:14px !important;color:' + textColor + ' !important;">' + safeEsc(subtitle) + '</div>';
    }

    html += '<div class="nvx-sv-scroll">';

    for (var i = 0; i < videos.length; i++) {
      var v = videos[i];
      var vUrl = safeEsc(v.url || "");
      var vTitle = safeEsc(v.title || "Video");

      if (displayFormat === "circles") {
        html += '<div class="nvx-sv-circle-card" onclick="window.nvxOpenVideoModal(\'' + vUrl + '\',\'' + vTitle + '\',\'' + safeEsc(ctaText) + '\',\'' + safeEsc(ctaBgColor) + '\',\'' + safeEsc(ctaTextColor) + '\');">';
        html += '<div class="nvx-sv-circle-ring">';
        html += '<video src="' + vUrl + '" class="nvx-sv-circle-img" muted playsinline></video>';
        html += '</div>';
        html += '<span style="font-size:11px !important;font-weight:700 !important;color:' + textColor + ' !important;max-width:68px !important;overflow:hidden !important;text-overflow:ellipsis !important;white-space:nowrap !important;">' + vTitle + '</span>';
        html += '</div>';
      } else {
        var autoMuted = autoplay === "muted" || autoplay === "sound" ? " autoplay muted" : "";
        html += '<div class="nvx-sv-card" onclick="window.nvxOpenVideoModal(\'' + vUrl + '\',\'' + vTitle + '\',\'' + safeEsc(ctaText) + '\',\'' + safeEsc(ctaBgColor) + '\',\'' + safeEsc(ctaTextColor) + '\');">';
        html += '<video src="' + vUrl + '" style="width:100% !important;height:100% !important;object-fit:cover !important;"' + autoMuted + ' loop playsinline></video>';
        html += '<div style="position:absolute !important;bottom:0 !important;left:0 !important;right:0 !important;padding:10px !important;background:linear-gradient(transparent, rgba(0,0,0,0.85)) !important;display:flex !important;flex-direction:column !important;gap:6px !important;">';
        html += '<span style="font-size:11px !important;color:#ffffff !important;font-weight:700 !important;overflow:hidden !important;text-overflow:ellipsis !important;white-space:nowrap !important;">' + vTitle + '</span>';
        if (ctaText) {
          html += '<div style="background:' + ctaBgColor + ' !important;color:' + ctaTextColor + ' !important;border-radius:6px !important;padding:6px !important;font-size:10px !important;font-weight:800 !important;text-align:center !important;">' + safeEsc(ctaText) + '</div>';
        }
        html += '</div>';
        html += '</div>';
      }
    }

    html += '</div>';

    var container = document.createElement("div");
    container.id = elementId;
    container.className = "nvx-widget nvx-slider-videos-wrapper";
    container.innerHTML = html;

    var targetEl = null;
    if (position === "after-description") {
      var descSelectors = [".js-product-description", ".product-description", "#description", ".description", ".product-details"];
      for (var dIdx = 0; dIdx < descSelectors.length; dIdx++) {
        var dEl = document.querySelector(descSelectors[dIdx]);
        if (dEl) { targetEl = dEl; break; }
      }
    }

    if (!targetEl) {
      var buySelectors = [
        "form[action*='/cart/add']",
        "form.js-product-form",
        ".js-product-buy-container",
        ".product-buy-container",
        "form.js-product-buyform",
        ".js-add-to-cart-btn",
        "#product_form",
        "form[action*='/cart']",
        "form[action*='/comprar']",
        ".product-form"
      ];
      for (var sIdx = 0; sIdx < buySelectors.length; sIdx++) {
        var bEl = document.querySelector(buySelectors[sIdx]);
        if (bEl) { targetEl = bEl; break; }
      }
    }

    if (targetEl && targetEl.parentNode) {
      targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
    } else {
      var main = document.querySelector("main, #content, .main-content, .js-product-container, .product-container, #single-product, .product");
      if (main) {
        main.appendChild(container);
      } else if (document.body) {
        document.body.appendChild(container);
      }
    }

    if (typeof nvxTrack === "function") {
      nvxTrack(w.id, "impression");
    }
  }

  if (typeof window.nvxOpenVideoModal !== "function") {
    window.nvxOpenVideoModal = function (url, title, ctaText, ctaBg, ctaColor) {
      var modalId = "nvx-video-modal-overlay";
      var existing = document.getElementById(modalId);
      if (existing) existing.remove();

      var overlay = document.createElement("div");
      overlay.id = modalId;
      overlay.style.cssText = "position:fixed !important;top:0 !important;left:0 !important;width:100vw !important;height:100vh !important;background:rgba(0,0,0,0.85) !important;z-index:999999 !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:16px !important;box-sizing:border-box !important;";

      var content = "";
      content += '<div style="position:relative !important;width:100% !important;max-width:380px !important;height:80vh !important;max-height:680px !important;background:#000000 !important;border-radius:16px !important;overflow:hidden !important;display:flex !important;flex-direction:column !important;box-shadow:0 10px 30px rgba(0,0,0,0.5) !important;">';
      content += '<button type="button" onclick="document.getElementById(\'' + modalId + '\').remove();" style="position:absolute !important;top:12px !important;right:12px !important;z-index:10 !important;background:rgba(0,0,0,0.6) !important;color:#fff !important;border:none !important;width:32px !important;height:32px !important;border-radius:50% !important;font-size:16px !important;font-weight:800 !important;cursor:pointer !important;display:flex !important;align-items:center !important;justify-content:center !important;">✕</button>';
      content += '<video src="' + url + '" style="width:100% !important;height:100% !important;object-fit:cover !important;" autoplay controls playsinline></video>';
      if (ctaText) {
        content += '<div style="position:absolute !important;bottom:16px !important;left:16px !important;right:16px !important;z-index:10 !important;">';
        content += '<button type="button" onclick="window.nvxSubmitVideoCta();" style="width:100% !important;background:' + (ctaBg || "#111827") + ' !important;color:' + (ctaColor || "#ffffff") + ' !important;border:none !important;border-radius:999px !important;padding:14px !important;font-size:15px !important;font-weight:800 !important;cursor:pointer !important;box-shadow:0 4px 12px rgba(0,0,0,0.3) !important;">' + ctaText + '</button>';
        content += '</div>';
      }
      content += '</div>';

      overlay.innerHTML = content;
      document.body.appendChild(overlay);
    };
  }

  if (typeof window.nvxSubmitVideoCta !== "function") {
    window.nvxSubmitVideoCta = function () {
      var modal = document.getElementById("nvx-video-modal-overlay");
      if (modal) modal.remove();

      var buyBtn = document.querySelector("button.js-add-to-cart-btn, form[action*='/cart/add'] button[type='submit'], .js-product-buy-container button, .product-buy-container button, #add-to-cart-button");
      if (buyBtn) {
        buyBtn.click();
      } else {
        var form = document.querySelector("form[action*='/cart/add'], form.js-product-form");
        if (form) form.submit();
      }
    };
        }
/* ═══════════════════════════════════════════
   WIDGET: BARRA DE ACCIÓN (v209)
   ═══════════════════════════════════════════ */
var renderBarraAccion = function(w) {
  var pType = typeof detectPageType === "function" ? detectPageType() : "";
  if (pType !== "product" && pType !== "item") return;

  var cfg = w.config || {};
  var onlyMobile = !!cfg.onlyMobile;
  if (onlyMobile && window.innerWidth > 768) return;

  // Evitar duplicados
  if (document.getElementById("nvx-barra-accion")) return;

  // Datos del producto
  var prod = window.LS && window.LS.product ? window.LS.product : null;
  var prodName = prod && prod.name ? prod.name : "";
  var prodImg = "";
  if (prod && prod.images && prod.images.length > 0) {
    prodImg = typeof prod.images[0] === "string" ? prod.images[0] : (prod.images[0].src || "");
  }

  // Fallbacks DOM si faltan datos en window.LS
  if (!prodName) {
    var titleEl = document.querySelector("h1, .product-title, .js-product-name");
    if (titleEl) prodName = titleEl.innerText.trim();
  }
  if (!prodImg) {
    var imgEl = document.querySelector("img[src*='products'], .product-image img, .js-product-image");
    if (imgEl) prodImg = imgEl.src;
  }

  // Precio del producto
  var prodPriceStr = "";
  if (prod && prod.price) {
    var rawP = prod.price;
    if (typeof normalizeToPesos === "function") rawP = normalizeToPesos(rawP);
    prodPriceStr = "$" + Math.round(rawP).toLocaleString("es-AR");
  } else {
    var priceEl = document.querySelector(".js-price-display, .product-price, #price_display");
    if (priceEl) prodPriceStr = priceEl.innerText.trim();
  }

  // Estilos y opciones
  var mode = cfg.displayMode || "bar";
  var barBg = cfg.barBg || "#333333";
  var titleColor = cfg.titleColor || "#ffffff";
  var priceColor = cfg.priceColor || "#10B981";
  var buttonBg = cfg.buttonBg || "#007bff";
  var buttonTextColor = cfg.buttonTextColor || "#ffffff";
  var buttonText = cfg.buttonText || "Agregar al carrito";
  var borderRadius = (cfg.buttonBorderRadius !== undefined ? cfg.buttonBorderRadius : 25) + "px";
  var isBold = cfg.buttonTextStyle === "bold";
  var showCartIcon = !!cfg.showCartIcon;
  var hasAureola = cfg.buttonEffect === "aureola";
  var isGradient = !!cfg.buttonGradient;

  var btnBgStyle = isGradient ? "linear-gradient(135deg, " + buttonBg + ", #0056b3)" : buttonBg;
  var aureolaCss = hasAureola ? "box-shadow: 0 0 16px " + buttonBg + " !important;" : "box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;";

  var container = document.createElement("div");
  container.id = "nvx-barra-accion";

  var cssText = "position: fixed !important; bottom: 0 !important; left: 0 !important; width: 100% !important; z-index: 999998 !important; box-sizing: border-box !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;";

  if (mode === "bar") {
    cssText += " background: " + barBg + " !important; padding: 10px 16px !important; display: flex !important; align-items: center !important; justify-content: space-between !important; gap: 10px !important; box-shadow: 0 -4px 20px rgba(0,0,0,0.15) !important;";
  } else {
    cssText += " padding: 12px 16px !important; pointer-events: none !important; display: flex !important; justify-content: center !important;";
  }

  container.style.cssText = cssText;

  var cartIconHtml = showCartIcon ? '<span style="margin-right: 6px !important;">🛒</span>' : '';
  var fontWeightCss = isBold ? "800" : "500";

  var html = "";
  if (mode === "bar") {
    html += '<div style="display: flex !important; align-items: center !important; gap: 10px !important; min-width: 0 !important; flex: 1 !important;">';
    if (prodImg) {
      html += '<img src="' + prodImg + '" style="width: 36px !important; height: 36px !important; border-radius: 6px !important; object-fit: cover !important; flex-shrink: 0 !important; border: 1px solid rgba(255,255,255,0.2) !important;" />';
    }
    html += '<div style="min-width: 0 !important; flex: 1 !important;">';
    html += '<div style="font-size: 13px !important; font-weight: 700 !important; color: ' + titleColor + ' !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; line-height: 1.2 !important;">' + (prodName || 'Producto') + '</div>';
    if (prodPriceStr) {
      html += '<div style="font-size: 13px !important; font-weight: 800 !important; color: ' + priceColor + ' !important; margin-top: 2px !important;">' + prodPriceStr + '</div>';
    }
    html += '</div>';
    html += '</div>';

    html += '<button type="button" onclick="window.nvxSubmitBarraAccion(' + (cfg.redirectToCheckout ? 'true' : 'false') + ')" style="background: ' + btnBgStyle + ' !important; color: ' + buttonTextColor + ' !important; border: none !important; border-radius: ' + borderRadius + ' !important; padding: 10px 18px !important; font-size: 13px !important; font-weight: ' + fontWeightCss + ' !important; cursor: pointer !important; flex-shrink: 0 !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; ' + aureolaCss + '">';
    html += cartIconHtml + '<span>' + buttonText + '</span>';
    html += '</button>';
  } else {
    html += '<button type="button" onclick="window.nvxSubmitBarraAccion(' + (cfg.redirectToCheckout ? 'true' : 'false') + ')" style="pointer-events: auto !important; width: 100% !important; max-width: 400px !important; background: ' + btnBgStyle + ' !important; color: ' + buttonTextColor + ' !important; border: none !important; border-radius: ' + borderRadius + ' !important; padding: 14px 20px !important; font-size: 15px !important; font-weight: ' + fontWeightCss + ' !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; ' + aureolaCss + '">';
    html += cartIconHtml + '<span>' + buttonText + '</span>';
    html += '</button>';
  }

  container.innerHTML = html;
  document.body.appendChild(container);
};

window.nvxSubmitBarraAccion = function(redirectCheckout) {
  var prod = window.LS && window.LS.product ? window.LS.product : null;
  var productId = prod ? prod.id : null;
  var variantId = null;

  var form = document.querySelector("form[action*='/cart/add']");
  if (form) {
    var vInput = form.querySelector("[name='variant_id']");
    if (vInput && vInput.value) variantId = vInput.value;
  }
  if (!variantId && prod && prod.variants && prod.variants.length > 0) {
    variantId = prod.variants[0].id;
  }
  if (!productId && form) {
    var pInput = form.querySelector("[name='add_to_cart']");
    if (pInput && pInput.value) productId = pInput.value;
  }

  if (!productId) {
    if (form) {
      var submitBtn = form.querySelector("input[type='submit'], button[type='submit'], .js-addtocart");
      if (submitBtn) {
        submitBtn.click();
        return;
      }
    }
  }

  // NubeSDK
  if (window.nube && typeof window.nube.send === "function") {
    try {
      window.nube.send("cart:add", {
        product_id: productId,
        variant_id: variantId,
        quantity: 1
      });
      if (redirectCheckout) {
        window.location.href = "/comprar/";
      } else {
        window.nube.send("cart:open");
      }
      return;
    } catch(err) {}
  }

  // Fallback POST
  var formData = new FormData();
  if (productId) formData.append("add_to_cart", productId);
  if (variantId) formData.append("variant_id", variantId);
  formData.append("quantity", "1");

  fetch("/comprar/", {
    method: "POST",
    body: formData,
    credentials: "include"
  }).then(function() {
    if (redirectCheckout) {
      window.location.href = "/comprar/";
    } else {
      window.location.reload();
    }
  }).catch(function() {
    if (form) {
      var submitBtn = form.querySelector("input[type='submit'], button[type='submit'], .js-addtocart");
      if (submitBtn) submitBtn.click();
    }
  });
};
  /* ═══════════════════════════════════════════
   WIDGET: MENSAJE DE GARANTÍA (v210)
   ═══════════════════════════════════════════ */
var renderMensajeGarantia = function(w) {
  var pType = typeof detectPageType === "function" ? detectPageType() : "";
  var cfg = w.config || {};

  var showProduct = cfg.showOnProductPage !== false;
  var showCart = !!cfg.showOnCart;

  var isProductPage = pType === "product" || pType === "item";
  var isCartPage = pType === "cart" || window.location.pathname.indexOf("/cart") !== -1;

  if (isProductPage && !showProduct) return;
  if (isCartPage && !showCart) return;
  if (!isProductPage && !isCartPage) return;

  // Evitar duplicados
  if (document.getElementById("nvx-mensaje-garantia")) return;

  var title = cfg.title || "";
  var text = cfg.text || "";
  var iconType = cfg.iconType || "preset";
  var presetIcon = cfg.presetIcon || "🛡️";
  var imageUrl = cfg.imageUrl || "";

  var bgColor = cfg.bgColor || "#fff9f3";
  var titleColor = cfg.titleColor || "#000000";
  var textColor = cfg.textColor || "#333333";
  var borderColor = cfg.borderColor || "#e7dec8";

  var titleFontSize = (cfg.titleFontSize || 16) + "px";
  var textFontSize = (cfg.textFontSize || 14) + "px";
  var borderRadius = (cfg.borderRadius !== undefined ? cfg.borderRadius : 12) + "px";
  var padding = (cfg.padding !== undefined ? cfg.padding : 16) + "px";
  var marginTop = (cfg.marginTop !== undefined ? cfg.marginTop : 16) + "px";
  var marginBottom = (cfg.marginBottom !== undefined ? cfg.marginBottom : 16) + "px";

  var container = document.createElement("div");
  container.id = "nvx-mensaje-garantia";

  container.style.cssText = "background: " + bgColor + " !important; border: 1.5px solid " + borderColor + " !important; border-radius: " + borderRadius + " !important; padding: " + padding + " !important; margin-top: " + marginTop + " !important; margin-bottom: " + marginBottom + " !important; display: flex !important; align-items: flex-start !important; gap: 12px !important; box-sizing: border-box !important; width: 100% !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;";

  var iconHtml = "";
  if (iconType === "image" && imageUrl) {
    iconHtml = '<img src="' + imageUrl + '" style="width: 38px !important; height: 38px !important; border-radius: 8px !important; object-fit: cover !important; flex-shrink: 0 !important;" />';
  } else {
    iconHtml = '<div style="width: 38px !important; height: 38px !important; border-radius: 8px !important; background: rgba(0,0,0,0.04) !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 22px !important; flex-shrink: 0 !important;">' + presetIcon + '</div>';
  }

  var contentHtml = '<div style="flex: 1 !important; min-width: 0 !important;">';
  if (title) {
    contentHtml += '<div style="font-size: ' + titleFontSize + ' !important; font-weight: 800 !important; color: ' + titleColor + ' !important; margin-bottom: 4px !important; line-height: 1.3 !important;">' + title + '</div>';
  }
  if (text) {
    contentHtml += '<div style="font-size: ' + textFontSize + ' !important; color: ' + textColor + ' !important; line-height: 1.5 !important; opacity: 0.9 !important;">' + text + '</div>';
  }
  contentHtml += '</div>';

  container.innerHTML = iconHtml + contentHtml;

  // Inyección DOM según ubicación (Regla #44)
  if (isProductPage) {
    var targetEl = document.querySelector("form[action*='/cart/add'], .js-product-form, .product-form, #product-form");
    if (targetEl && targetEl.parentNode) {
      targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
    } else {
      var btn = document.querySelector("input[type='submit'], button[type='submit'], .js-addtocart");
      if (btn && btn.parentNode) {
        btn.parentNode.insertBefore(container, btn.nextSibling);
      } else {
        document.body.appendChild(container);
      }
    }
  } else {
    var cartSummary = document.querySelector(".cart-summary, .js-cart-total, #cart-total");
    if (cartSummary && cartSummary.parentNode) {
      cartSummary.parentNode.insertBefore(container, cartSummary.nextSibling);
    } else {
      document.body.appendChild(container);
    }
  }
};
        /* ═══════════════════════════════════════════
   WIDGET: BADGE DE EFECTIVO (v214)
   ═══════════════════════════════════════════ */
var renderBadgeEfectivo = function(w) {
  var pType = typeof detectPageType === "function" ? detectPageType() : "";
  var cfg = w.config || {};

  var showProduct = cfg.showOnProductPage !== false;
  var showGrid = !!cfg.showOnGrid;
  var showSticky = !!cfg.stickyGlobal;

  var isProductPage = pType === "product" || pType === "item";
  var isHomeOrCategory = pType === "home" || pType === "category" || pType === "list" || pType === "search";

  // Helper: parseador exacto de precios formato AR/LATAM ($ 35.000,00 o $ 35.000)
  var parseExactPrice = function(val) {
    if (val === null || val === undefined || val === "") return 0;
    if (typeof val === "number") {
      if (val > 10000000) return val / 100; // Céntimos API Tiendanube
      return val;
    }
    var str = String(val).trim();
    if (!str) return 0;

    // Si tiene coma, el decimal está después de la coma (ej: "35.000,00" o "3.500,50")
    if (str.indexOf(",") !== -1) {
      var parts = str.split(",");
      var intPart = parts[0].replace(/[^\d]/g, "");
      var decPart = parts[1] ? parts[1].replace(/[^\d]/g, "") : "0";
      if (decPart.length === 1) decPart += "0";
      var res = parseFloat(intPart + "." + decPart.substring(0, 2));
      return isNaN(res) ? 0 : res;
    } else {
      // Sin coma (ej: "$ 35.000" o "$ 35000")
      var digits = str.replace(/[^\d]/g, "");
      if (!digits) return 0;
      var num = parseFloat(digits);
      return isNaN(num) ? 0 : num;
    }
  };

  // Helper: construir HTML del badge
  var nvxBuildBadgeHtml = function(rawPrice, cfgLocal) {
    if (!rawPrice || rawPrice <= 0) return null;

    var discPercent = parseFloat(cfgLocal.discountPercent) || 10;
    var discPrice = rawPrice * (1 - discPercent / 100);
    var formattedDiscPrice = "$" + Math.round(discPrice).toLocaleString("es-AR");

    var msgType = cfgLocal.messageType || "percent";
    var rawMsg = msgType === "percent"
      ? (cfgLocal.customTextPercent || "{descuento}% de descuento pagando en efectivo")
      : (cfgLocal.customTextPrice || "{precio} pagando en efectivo");

    rawMsg = String(rawMsg);
    rawMsg = rawMsg.replace(/\$\{precio\}/g, formattedDiscPrice);
    rawMsg = rawMsg.replace(/\{precio\}/g, formattedDiscPrice);
    rawMsg = rawMsg.replace(/\{descuento\}/g, String(discPercent));
    rawMsg = rawMsg.replace(/\$\$/g, "$");

    var bgColor = cfgLocal.bgColor || "#f3f4f6";
    var textColor = cfgLocal.textColor || "#111827";
    var isGradient = !!cfgLocal.gradientBg;
    var containerBg = isGradient ? "linear-gradient(135deg, " + bgColor + ", #e5e7eb)" : bgColor;

    var fontSize = (cfgLocal.fontSize || 13) + "px";
    var padding = (cfgLocal.padding !== undefined ? cfgLocal.padding : 10) + "px";
    var borderRadius = (cfgLocal.borderRadius !== undefined ? cfgLocal.borderRadius : 20) + "px";
    var marginTop = (cfgLocal.marginTop !== undefined ? cfgLocal.marginTop : 8) + "px";
    var marginBottom = (cfgLocal.marginBottom !== undefined ? cfgLocal.marginBottom : 8) + "px";
    var showBorder = !!cfgLocal.showBorder;
    var borderColor = cfgLocal.borderColor || "#e5e7eb";

    var badgeText = cfgLocal.badgeText || "";
    var badgePos = cfgLocal.badgePosition || "top-right";
    var badgeBg = cfgLocal.badgeBgColor || "#ef4444";
    var badgeTextCol = cfgLocal.badgeTextColor || "#ffffff";
    var animation = cfgLocal.animation || "none";

    var cssText = "position: relative !important; display: inline-flex !important; align-items: center !important; gap: 6px !important; background: " + containerBg + " !important; color: " + textColor + " !important; font-size: " + fontSize + " !important; font-weight: 600 !important; padding: " + padding + " !important; border-radius: " + borderRadius + " !important; margin-top: " + marginTop + " !important; margin-bottom: " + marginBottom + " !important; box-sizing: border-box !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; width: auto !important; max-width: 100% !important; clear: both !important; line-height: 1.3 !important;";

    if (showBorder) cssText += " border: 1px solid " + borderColor + " !important;";
    if (animation === "aureola") cssText += " box-shadow: 0 0 12px " + badgeBg + " !important;";

    var html = "";
    if (badgeText && badgePos === "top-right") {
      html += '<span style="position: absolute !important; top: -8px !important; right: 8px !important; background: ' + badgeBg + ' !important; color: ' + badgeTextCol + ' !important; font-size: 9px !important; font-weight: 900 !important; padding: 2px 6px !important; border-radius: 4px !important; text-transform: uppercase !important; letter-spacing: 0.03em !important; box-shadow: 0 2px 4px rgba(0,0,0,0.12) !important; z-index: 2 !important;">' + badgeText + '</span>';
    }
    if (cfgLocal.showCoinIcon !== false) {
      html += '<span style="font-size: ' + (parseInt(fontSize, 10) + 2) + 'px !important; line-height: 1 !important;">💵</span>';
    }
    html += '<span>' + rawMsg + '</span>';
    if (badgeText && badgePos === "end-text") {
      html += '<span style="background: ' + badgeBg + ' !important; color: ' + badgeTextCol + ' !important; font-size: 9px !important; font-weight: 900 !important; padding: 2px 6px !important; border-radius: 4px !important; text-transform: uppercase !important; letter-spacing: 0.03em !important; margin-left: 4px !important;">' + badgeText + '</span>';
    }

    return { cssText: cssText, html: html };
  };

  // --- 1. STICKY GLOBAL ---
  if (showSticky && !document.getElementById("nvx-badge-efectivo-sticky")) {
    var discSticky = parseFloat(cfg.discountPercent) || 10;
    var stickyBg = cfg.bgColor || "#111827";
    var stickyTx = cfg.textColor || "#ffffff";
    var stickyEl = document.createElement("div");
    stickyEl.id = "nvx-badge-efectivo-sticky";
    stickyEl.style.cssText = "position: fixed !important; bottom: 0 !important; left: 0 !important; width: 100% !important; z-index: 999997 !important; background: " + stickyBg + " !important; color: " + stickyTx + " !important; padding: 10px 16px !important; text-align: center !important; font-size: 13px !important; font-weight: 700 !important; box-shadow: 0 -4px 15px rgba(0,0,0,0.15) !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 8px !important; box-sizing: border-box !important;";
    stickyEl.innerHTML = '<span>💵</span><span>¡Aprovechá hasta <strong>' + discSticky + '% OFF</strong> pagando en efectivo o transferencia!</span>';
    document.body.appendChild(stickyEl);
  }

  // --- 2. FICHA DE PRODUCTO ---
  if (isProductPage && showProduct && !document.getElementById("nvx-badge-efectivo-product")) {
    var rawPrice = 0;

    // A) Probar desde DOM directo (elementos de precio de venta activo, ignorando tachados)
    var selSelectors = [
      "#price_display",
      ".js-price-display:not(.js-compare-price-display)",
      ".js-product-price:not(.js-compare-price)",
      "#product-price",
      "[data-store='product-price']"
    ];

    for (var s = 0; s < selSelectors.length; s++) {
      var pEl = document.querySelector(selSelectors[s]);
      if (pEl) {
        var txtP = pEl.innerText || pEl.textContent || "";
        var parsedP = parseExactPrice(txtP);
        if (parsedP > 0) {
          rawPrice = parsedP;
          break;
        }
      }
    }

    // B) Si no hay precio en DOM directo, probar window.LS.product
    if (!rawPrice && window.LS && window.LS.product) {
      var prod = window.LS.product;
      var pVal = prod.price_number || prod.price || 0;
      if (prod.variants && prod.variants[0]) {
        pVal = prod.variants[0].price_number || prod.variants[0].price || pVal;
      }
      rawPrice = parseExactPrice(pVal);
    }

    // C) Fallback genérico DOM
    if (!rawPrice) {
      var priceNodes = document.querySelectorAll(".js-price-display, .product-price, .price");
      if (priceNodes && priceNodes.length > 0) {
        for (var n = priceNodes.length - 1; n >= 0; n--) {
          var node = priceNodes[n];
          if (node.classList && node.classList.contains("js-compare-price-display")) continue;
          var pTxt = node.innerText || node.textContent || "";
          var pParsed = parseExactPrice(pTxt);
          if (pParsed > 0) {
            rawPrice = pParsed;
            break;
          }
        }
      }
    }

    if (rawPrice > 0) {
      var built = nvxBuildBadgeHtml(rawPrice, cfg);
      if (built) {
        var container = document.createElement("div");
        container.id = "nvx-badge-efectivo-product";
        container.style.cssText = built.cssText;
        container.innerHTML = built.html;

        var inserted = false;
        var priceBlock = document.querySelector(
          ".js-price-container, .js-product-price-container, .product-price-container, .price-container, .js-item-price, [data-store='product-price']"
        );
        if (priceBlock && priceBlock.parentNode) {
          var parentBlock = priceBlock.closest
            ? (priceBlock.closest(".js-price-container, .js-product-price-container, .product-price-container, .price-container, .product-form, form") || priceBlock.parentNode)
            : priceBlock.parentNode;
          if (parentBlock && parentBlock.parentNode && parentBlock !== document.body) {
            parentBlock.parentNode.insertBefore(container, parentBlock.nextSibling);
            inserted = true;
          } else if (priceBlock.parentNode) {
            priceBlock.parentNode.insertBefore(container, priceBlock.nextSibling);
            inserted = true;
          }
        }

        if (!inserted) {
          var allPrices = document.querySelectorAll(".js-price-display, #price_display, .js-product-price");
          if (allPrices && allPrices.length > 0) {
            var lastP = allPrices[allPrices.length - 1];
            var wrap = lastP.parentNode;
            if (wrap && wrap.parentNode && wrap.parentNode !== document.body) {
              wrap.parentNode.insertBefore(container, wrap.nextSibling);
            } else if (wrap) {
              wrap.insertBefore(container, lastP.nextSibling);
            }
            inserted = true;
          }
        }

        if (!inserted) {
          var formEl = document.querySelector("form[action*='/cart/add'], .js-product-form, .product-form");
          if (formEl && formEl.parentNode) {
            formEl.parentNode.insertBefore(container, formEl);
          } else {
            document.body.appendChild(container);
          }
        }
      }
    }
  }

  // --- 3. GRILLA / HOME / CATEGORÍA / LISTADOS ---
  if (isHomeOrCategory && showGrid) {
    var cards = document.querySelectorAll(
      ".js-item-product, .item-product, .product-item, .js-product-container, [data-product-id], .product-card, .card-product, .item, article[data-product]"
    );

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      if (!card || card.querySelector(".nvx-badge-efectivo-grid")) continue;

      var cardPrice = 0;

      // A) Data attributes de la card
      var dataP = card.getAttribute("data-product-price") || card.getAttribute("data-price");
      if (dataP) cardPrice = parseExactPrice(dataP);

      // B) Elemento de precio en la card
      if (!cardPrice) {
        var cardPriceEl = card.querySelector(
          ".js-price-display:not(.js-compare-price-display), .item-price:not(.item-price-compare), .js-product-price, .product-price, .price"
        );
        if (cardPriceEl) {
          var ct = cardPriceEl.innerText || cardPriceEl.textContent || cardPriceEl.getAttribute("data-price") || "";
          cardPrice = parseExactPrice(ct);
        }
      }

      if (cardPrice > 0) {
        var builtG = nvxBuildBadgeHtml(cardPrice, cfg);
        if (builtG) {
          var gEl = document.createElement("div");
          gEl.className = "nvx-badge-efectivo-grid";
          gEl.style.cssText = builtG.cssText + " margin-left: 0 !important; margin-right: 0 !important;";
          gEl.innerHTML = builtG.html;

          var priceInCard = card.querySelector(".js-price-display, .item-price, .product-price, .price, .js-product-price");
          if (priceInCard && priceInCard.parentNode) {
            var priceParent = priceInCard.parentNode;
            if (priceParent.parentNode && priceParent !== card) {
              priceParent.parentNode.insertBefore(gEl, priceParent.nextSibling);
            } else {
              priceInCard.parentNode.insertBefore(gEl, priceInCard.nextSibling);
            }
          } else {
            card.appendChild(gEl);
          }
        }
      }
    }
  }
};
        /* ═══════════════════════════════════════════
     WIDGET #20: PREGUNTAS FRECUENTES (FAQ)
     ═══════════════════════════════════════════ */
  var renderPreguntasFrecuentes = function(w) {
    try {
      if (!w || !w.is_active) return;
      if (detectPageType() !== "product") return;

      var containerId = "nvx-faq-" + (w.id || "default");
      if (document.getElementById(containerId)) return;

      var cfg = w.config || {};
      var items = cfg.items || [];
      if (!items || items.length === 0) return;

      var title = cfg.title || "";
      var showFirstOpen = cfg.showFirstOpen !== false;
      var position = cfg.position || "before_desc";

      var bgColor = cfg.bgColor || "#ffffff";
      var cardBgColor = cfg.cardBgColor || "#f7f7f7";
      var titleColor = cfg.titleColor || "#000000";
      var textColor = cfg.textColor || "#333333";
      var borderColor = cfg.borderColor || "#e5e7eb";

      var titleFontSize = (cfg.titleFontSize || 18) + "px";
      var questionFontSize = (cfg.questionFontSize || 15) + "px";
      var answerFontSize = (cfg.answerFontSize || 14) + "px";
      var questionFontWeight = cfg.questionFontWeight === "normal" ? "400" : "700";
      var borderRadius = (cfg.borderRadius !== undefined ? cfg.borderRadius : 8) + "px";
      var enableBorder = cfg.enableBorder === true;
      var questionSpacing = cfg.questionSpacing || "with_space";
      var toggleIconType = cfg.toggleIconType || "arrow";

      // Ubicación del target element con Multi-Detector Robusto
      var targetEl = null;
      var insertMode = "after";

      if (position === "after_desc") {
        targetEl = document.querySelector(".js-product-description, .product-description, #description, .description-container, .user-content, [data-store='product-description']");
        insertMode = "after";
      } else {
        // "before_desc": 1. Buscar primero el botón nativo de comprar
        var buyBtn = document.querySelector(".js-addtocart, .js-add-to-cart, [data-store='product-buy-button'], input[name='add_to_cart'], button.js-addtocart, .js-prod-submit-container");
        if (buyBtn) {
          targetEl = buyBtn.closest("form") || buyBtn.closest(".js-product-form") || buyBtn.parentElement;
          insertMode = "after";
        }

        // 2. Buscar formulario de compra
        if (!targetEl) {
          targetEl = document.querySelector("form[action*='/cart/add'], form[action*='/comprar'], form[action*='cart'], form[action*='comprar'], form.js-product-form, .js-product-form, .js-addtocart-form");
          insertMode = "after";
        }

        // 3. Buscar contenedor de cálculo de envío o pagos (justo abajo del botón)
        if (!targetEl) {
          var shippingCalc = document.querySelector(".js-shipping-calculator-container, #shipping-calculator, .shipping-calculator-container, [data-store='shipping-calculator'], .js-product-payments-container");
          if (shippingCalc) {
            targetEl = shippingCalc;
            insertMode = "before";
          }
        }
      }

      // Fallback universal
      if (!targetEl) {
        targetEl = document.querySelector(".js-product-description, .product-description, #description, body");
        insertMode = "after";
      }

      if (!targetEl || !targetEl.parentNode) return;

      var container = document.createElement("div");
      container.id = containerId;
      container.style.cssText = "width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; margin: 16px 0 !important; padding: 16px !important; background-color: " + bgColor + " !important; border-radius: " + borderRadius + " !important; border: 1.5px solid " + borderColor + " !important; font-family: inherit !important; clear: both !important; flex-basis: 100% !important; display: block !important;";

      var html = "";
      if (title && title.length > 0) {
        html += '<div style="font-size: ' + titleFontSize + ' !important; font-weight: 800 !important; color: ' + titleColor + ' !important; margin-bottom: 14px !important; line-height: 1.3 !important;">' + title + '</div>';
      }

      var gapStyle = questionSpacing === "with_space" ? "margin-bottom: 8px !important;" : "margin-bottom: 0px !important;";

      html += '<div class="nvx-faq-list" style="display: flex !important; flex-direction: column !important;">';

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var isOpen = (i === 0 && showFirstOpen);
        var isFirst = i === 0;
        var isLast = i === items.length - 1;

        var borderStyle = enableBorder ? "border: 1.5px solid " + borderColor + " !important;" : "border: none !important;";
        if (questionSpacing === "no_space" && !isLast && !enableBorder) {
          borderStyle = "border-bottom: 1px solid " + borderColor + " !important;";
        }

        var itemRadius = borderRadius;
        if (questionSpacing === "no_space") {
          if (isFirst) itemRadius = borderRadius + " " + borderRadius + " 0 0";
          else if (isLast) itemRadius = "0 0 " + borderRadius + " " + borderRadius;
          else itemRadius = "0";
        }

        var arrowChar = toggleIconType === "arrow" ? (isOpen ? "▲" : "▼") : (isOpen ? "−" : "+");
        var displayAnswer = isOpen ? "block" : "none";

        html += '<div class="nvx-faq-item" style="background-color: ' + cardBgColor + ' !important; border-radius: ' + itemRadius + ' !important; ' + borderStyle + ' ' + (isLast ? '' : gapStyle) + ' overflow: hidden !important; transition: all 0.2s !important;">';
        
        html += '<button type="button" class="nvx-faq-trigger" style="width: 100% !important; padding: 12px 14px !important; display: flex !important; align-items: center !important; justify-content: space-between !important; gap: 10px !important; background: transparent !important; border: none !important; color: ' + textColor + ' !important; cursor: pointer !important; text-align: left !important; font-family: inherit !important;">';
        
        html += '<div style="display: flex !important; align-items: center !important; gap: 8px !important;">';
        if (item.icon) {
          html += '<span style="font-size: 16px !important;">' + item.icon + '</span>';
        }
        html += '<span style="font-size: ' + questionFontSize + ' !important; font-weight: ' + questionFontWeight + ' !important; color: ' + textColor + ' !important;">' + (item.question || '') + '</span>';
        html += '</div>';

        html += '<span class="nvx-faq-icon" style="font-size: 14px !important; opacity: 0.7 !important; font-weight: 700 !important; color: ' + textColor + ' !important;">' + arrowChar + '</span>';
        html += '</button>';

        html += '<div class="nvx-faq-answer" style="display: ' + displayAnswer + ' !important; padding: 0 14px 12px !important; font-size: ' + answerFontSize + ' !important; color: ' + textColor + ' !important; opacity: 0.9 !important; line-height: 1.5 !important; border-top: 1px solid rgba(0,0,0,0.05) !important; padding-top: 8px !important;">' + (item.answer || '') + '</div>';

        html += '</div>';
      }

      html += '</div>';

      container.innerHTML = html;

      // Event listener para acordeón
      var triggers = container.querySelectorAll(".nvx-faq-trigger");
      for (var j = 0; j < triggers.length; j++) {
        triggers[j].addEventListener("click", function(e) {
          e.preventDefault();
          var btn = this;
          var parent = btn.parentElement;
          var answer = parent.querySelector(".nvx-faq-answer");
          var icon = btn.querySelector(".nvx-faq-icon");
          var isCurrentlyOpen = answer.style.display !== "none";

          if (isCurrentlyOpen) {
            answer.style.display = "none";
            if (icon) icon.innerText = toggleIconType === "arrow" ? "▼" : "+";
          } else {
            answer.style.display = "block";
            if (icon) icon.innerText = toggleIconType === "arrow" ? "▲" : "−";
          }
        });
      }

      if (insertMode === "before") {
        targetEl.parentNode.insertBefore(container, targetEl);
      } else {
        targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
      }
    } catch (e) {
      console.warn("Nevux FAQ Error:", e);
    }
  };
        /* ═══════════════════════════════════════════
     WIDGET #21: BANNER SUPERIOR / BARRA STICKY INFERIOR
     ═══════════════════════════════════════════ */
  var renderBannerSuperior = function(w) {
    try {
      if (!w || !w.is_active) return;

      var containerId = "nvx-banner-superior-" + (w.id || "default");
      if (document.getElementById(containerId)) return;

      var cfg = w.config || {};
      var text = cfg.text || "";
      if (!text || text.trim().length === 0) return;

      var buttonText = cfg.buttonText || "";
      var buttonUrl = cfg.buttonUrl || "";
      var openInNewTab = cfg.openInNewTab === true;
      var showCloseButton = cfg.showCloseButton !== false;

      var bgColor = cfg.bgColor || "#1e1e1e";
      var bgGradient = cfg.bgGradient === true;
      var buttonColor = cfg.buttonColor || "#ffffff";
      var btnGradient = cfg.btnGradient === true;
      var textColor = cfg.textColor || "#ffffff";
      var buttonTextColor = cfg.buttonTextColor || "#000000";

      var textFontSize = (cfg.textFontSize || 14) + "px";
      var buttonFontSize = (cfg.buttonFontSize || 13) + "px";
      var buttonFontWeight = cfg.buttonFontWeight === "bold" ? "700" : "400";
      var buttonBorderRadius = (cfg.buttonBorderRadius !== undefined ? cfg.buttonBorderRadius : 5) + "px";
      var padding = (cfg.padding !== undefined ? cfg.padding : 10) + "px";

      var container = document.createElement("div");
      container.id = containerId;

      var backgroundCSS = bgGradient
        ? "linear-gradient(135deg, " + bgColor + ", #000000)"
        : bgColor;

      // Estilo exacto probado de la barra sticky inferior
      container.style.cssText = "position: fixed !important; bottom: 0 !important; left: 0 !important; right: 0 !important; top: auto !important; width: 100% !important; max-width: 100vw !important; z-index: 999998 !important; background: " + backgroundCSS + " !important; color: " + textColor + " !important; padding: " + padding + " !important; box-sizing: border-box !important; font-family: inherit !important; box-shadow: 0 -4px 20px rgba(0,0,0,0.25) !important; display: flex !important; align-items: center !important; justify-content: center !important;";

      var btnBgCSS = btnGradient
        ? "linear-gradient(135deg, " + buttonColor + ", #e5e7eb)"
        : buttonColor;

      var html = '<div style="width: 100% !important; max-width: 1200px !important; margin: 0 auto !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 12px !important; flex-wrap: wrap !important; text-align: center !important; position: relative !important; padding-right: ' + (showCloseButton ? '36px' : '0px') + ' !important;">';

      html += '<div style="font-size: ' + textFontSize + ' !important; color: ' + textColor + ' !important; font-weight: 600 !important; line-height: 1.3 !important;">' + text + '</div>';

      if (buttonText && buttonText.length > 0) {
        var targetAttr = openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
        var finalUrl = buttonUrl && buttonUrl.length > 0 ? buttonUrl : '#';
        html += '<a href="' + finalUrl + '"' + targetAttr + ' style="background: ' + btnBgCSS + ' !important; color: ' + buttonTextColor + ' !important; font-size: ' + buttonFontSize + ' !important; font-weight: ' + buttonFontWeight + ' !important; border-radius: ' + buttonBorderRadius + ' !important; padding: 6px 14px !important; text-decoration: none !important; display: inline-block !important; white-space: nowrap !important; box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important; cursor: pointer !important;">' + buttonText + '</a>';
      }

      if (showCloseButton) {
        html += '<button type="button" class="nvx-banner-close" style="position: absolute !important; right: 0 !important; top: 50% !important; transform: translateY(-50%) !important; background: transparent !important; border: none !important; color: ' + textColor + ' !important; font-size: 18px !important; font-weight: bold !important; cursor: pointer !important; opacity: 0.85 !important; padding: 6px 10px !important; line-height: 1 !important;">✕</button>';
      }

      html += '</div>';
      container.innerHTML = html;

      if (showCloseButton) {
        var closeBtn = container.querySelector(".nvx-banner-close");
        if (closeBtn) {
          closeBtn.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            container.remove();
          });
        }
      }

      var mount = function() {
        if (document.body) {
          document.body.appendChild(container);
        }
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mount);
      } else {
        mount();
      }
    } catch (e) {
      console.warn("Nevux Banner Superior Error:", e);
    }
  };
    /* ═══════════════════════════════════════════
     RENDER: PACK COMPLEMENTARIOS (v1 — ES5 estricto)
  ═══════════════════════════════════════════ */
  function renderPackComplementarios(w) {
    if (!w || !w.config) return;

    var elementId = "nvx-pack-complementarios-" + w.id;
    if (document.getElementById(elementId)) return;

    var currentPage = typeof detectPageType === "function" ? detectPageType() : "";
    if (currentPage !== "product") return;

    var cfg = w.config || {};

    var title = cfg.title || "Armá tu Pack y Ahorrá";
    var mainProductTitle = cfg.mainProductTitle || "Este producto";
    var isMainOptional = cfg.isMainOptional === true;
    var buttonText = cfg.buttonText || "Agregar pack al carrito";
    var replaceCart = cfg.replaceCartButton !== false;
    var redirectCheckout = cfg.redirectToCheckout === true;
    var enableDiscount = cfg.enableQuantityDiscount !== false;
    var disc2 = Number(cfg.discount2Items) || 10;
    var disc3 = Number(cfg.discount3Items) || 15;
    var disc4 = Number(cfg.discount4Items) || 20;
    var showSavings = cfg.showSavingsBadge !== false;
    var savingsBadgeText = cfg.savingsBadgeText || "AHORRÁS $X";
    var savingsBadgeBg = cfg.savingsBadgeBg || "#059669";
    var savingsBadgeTextColor = cfg.savingsBadgeTextColor || "#ffffff";
    var borderRadius = (cfg.borderRadius || 14) + "px";

    var bgColor = cfg.bgColor || "#ffffff";
    var textColor = cfg.textColor || "#111827";
    var borderColor = cfg.borderColor || "#e5e7eb";
    var accentColor = cfg.accentColor || "#10B981";
    var selectedBorderColor = cfg.selectedBorderColor || "#10B981";
    var buttonBg = cfg.buttonBg || "#111827";
    var buttonTextColor = cfg.buttonTextColor || "#ffffff";

    var THEMES = {
      "black-friday": { bg: "#111827", text: "#ffffff", border: "#374151", accent: "#F59E0B", selBorder: "#F59E0B", btn: "#F59E0B", btnText: "#111827", badgeBg: "#F59E0B", badgeText: "#111827" },
      "hot-sale": { bg: "#0F172A", text: "#ffffff", border: "#1e293b", accent: "#EF4444", selBorder: "#EF4444", btn: "#EF4444", btnText: "#ffffff", badgeBg: "#EF4444", badgeText: "#ffffff" },
      "cyber-monday": { bg: "#090D16", text: "#ffffff", border: "#1e3a5f", accent: "#3B82F6", selBorder: "#3B82F6", btn: "#3B82F6", btnText: "#ffffff", badgeBg: "#3B82F6", badgeText: "#ffffff" },
      "navidad": { bg: "#064E3B", text: "#ffffff", border: "#047857", accent: "#EF4444", selBorder: "#EF4444", btn: "#EF4444", btnText: "#ffffff", badgeBg: "#EF4444", badgeText: "#ffffff" },
      "san-valentin": { bg: "#831843", text: "#ffffff", border: "#9d174d", accent: "#F43F5E", selBorder: "#F43F5E", btn: "#F43F5E", btnText: "#ffffff", badgeBg: "#F43F5E", badgeText: "#ffffff" },
      "dia-padre-madre": { bg: "#312E81", text: "#ffffff", border: "#4338ca", accent: "#10B981", selBorder: "#10B981", btn: "#10B981", btnText: "#ffffff", badgeBg: "#10B981", badgeText: "#ffffff" },
      "liquidacion": { bg: "#7F1D1D", text: "#ffffff", border: "#991b1b", accent: "#FBBF24", selBorder: "#FBBF24", btn: "#FBBF24", btnText: "#7F1D1D", badgeBg: "#FBBF24", badgeText: "#7F1D1D" }
    };
    if (cfg.campaignTheme && cfg.campaignTheme !== "none" && THEMES[cfg.campaignTheme]) {
      var th = THEMES[cfg.campaignTheme];
      bgColor = th.bg;
      textColor = th.text;
      borderColor = th.border;
      accentColor = th.accent;
      selectedBorderColor = th.selBorder;
      buttonBg = th.btn;
      buttonTextColor = th.btnText;
      savingsBadgeBg = th.badgeBg;
      savingsBadgeTextColor = th.badgeText;
    }

    var unitPrice = 0;
    if (typeof window.nvxBundleGetProductPrice === "function") {
      unitPrice = window.nvxBundleGetProductPrice();
    } else {
      var priceEl = document.querySelector(".js-price-display, #price_display, .js-product-price, .product-price, .price-display");
      if (priceEl) {
        var rawTxt = priceEl.innerText || priceEl.textContent || "";
        var cleaned = String(rawTxt).replace(/[^0-9.,]/g, "").replace(/\./g, "").replace(",", ".");
        unitPrice = parseFloat(cleaned) || 0;
      }
    }

    var prodId = "";
    if (window.LS && window.LS.product && window.LS.product.id) {
      prodId = String(window.LS.product.id);
    } else if (window.LS && window.LS.product_id) {
      prodId = String(window.LS.product_id);
    } else if (w.target_product_id) {
      prodId = String(w.target_product_id);
    }

    var safeEsc = function (str) {
      if (!str) return "";
      return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    };

    var fmtMoney = function (num) {
      if (typeof window.nvxBundleFormatPrice === "function") {
        return window.nvxBundleFormatPrice(num);
      }
      var n = Math.round(Number(num) || 0);
      var s = String(n);
      var out = "";
      var c = 0;
      for (var i = s.length - 1; i >= 0; i--) {
        out = s.charAt(i) + out;
        c++;
        if (c === 3 && i > 0) { out = "." + out; c = 0; }
      }
      return "$" + out;
    };

    var styleId = "style-" + elementId;
    if (!document.getElementById(styleId)) {
      var styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.type = "text/css";
      var css =
        "#" + elementId + " {" +
          "background:" + bgColor + " !important;" +
          "border:1.5px solid " + borderColor + " !important;" +
          "border-radius:" + borderRadius + " !important;" +
          "padding:16px !important;" +
          "color:" + textColor + " !important;" +
          "box-sizing:border-box !important;" +
          "box-shadow:0 4px 14px rgba(0,0,0,0.05) !important;" +
          "display:flex !important;" +
          "flex-direction:column !important;" +
          "gap:10px !important;" +
          "margin:14px 0 !important;" +
          "width:100% !important;" +
          "font-family:system-ui,-apple-system,sans-serif !important;" +
        "}" +
        "#" + elementId + " .nvx-pc-item {" +
          "border-radius:10px !important;" +
          "padding:10px 12px !important;" +
          "border:1.5px solid " + borderColor + " !important;" +
          "display:flex !important;" +
          "align-items:center !important;" +
          "justify-content:space-between !important;" +
          "cursor:pointer !important;" +
          "transition:all 0.2s !important;" +
          "background:transparent !important;" +
          "user-select:none !important;" +
          "gap:10px !important;" +
        "}" +
        "#" + elementId + " .nvx-pc-item.selected {" +
          "border-color:" + selectedBorderColor + " !important;" +
          "background:rgba(16,185,129,0.04) !important;" +
        "}" +
        "#" + elementId + " .nvx-pc-chk {" +
          "width:18px !important;height:18px !important;accent-color:" + accentColor + " !important;" +
          "flex-shrink:0 !important;cursor:pointer !important;" +
        "}" +
        "#" + elementId + " .nvx-pc-thumb {" +
          "width:38px !important;height:38px !important;border-radius:8px !important;" +
          "object-fit:cover !important;flex-shrink:0 !important;background:#f3f4f6 !important;" +
        "}" +
        "#" + elementId + " .nvx-pc-btn {" +
          "width:100% !important;background:" + buttonBg + " !important;color:" + buttonTextColor + " !important;" +
          "border:none !important;border-radius:999px !important;padding:14px !important;" +
          "font-size:15px !important;font-weight:800 !important;cursor:pointer !important;" +
          "margin-top:6px !important;box-shadow:0 2px 8px rgba(0,0,0,0.1) !important;" +
          "transition:transform 0.1s !important;" +
        "}" +
        "#" + elementId + " .nvx-pc-btn:active { transform:scale(0.98) !important; }" +
        "#" + elementId + " .nvx-pc-btn:disabled { opacity:0.6 !important; cursor:not-allowed !important; }" +
        "#" + elementId + " .nvx-pc-badge {" +
          "font-size:10px !important;font-weight:800 !important;background:" + savingsBadgeBg + " !important;" +
          "color:" + savingsBadgeTextColor + " !important;padding:3px 8px !important;border-radius:6px !important;" +
        "}";
      styleEl.appendChild(document.createTextNode(css));
      document.head.appendChild(styleEl);
    }

    var html = "";

    // Header
    html += '<div style="display:flex !important;align-items:center !important;justify-content:space-between !important;margin-bottom:4px !important;">';
    html += '<div style="font-size:15px !important;font-weight:800 !important;color:' + textColor + ' !important;">' + safeEsc(title) + '</div>';
    html += '<div class="nvx-pc-badge" style="display:none !important;">' + safeEsc(savingsBadgeText) + '</div>';
    html += '</div>';

    // Lista de ítems (Principal + Complementarios)
    html += '<div style="display:flex !important;flex-direction:column !important;gap:8px !important;width:100% !important;">';

    // 1. Producto Principal
    html += '<label class="nvx-pc-item selected" id="' + elementId + '-main-row">';
    html += '<div style="display:flex !important;align-items:center !important;gap:10px !important;flex:1 !important;min-width:0 !important;">';
    html += '<input type="checkbox" class="nvx-pc-chk nvx-pc-main-chk" data-main-id="' + safeEsc(String(prodId)) + '" data-price="' + unitPrice + '" checked' + (isMainOptional ? "" : " disabled") + ' onchange="window.nvxPackUpdateTotal(\'' + elementId + '\');" />';
    html += '<div style="width:38px !important;height:38px !important;border-radius:8px !important;background:#e5e7eb !important;display:flex !important;align-items:center !important;justify-content:center !important;font-size:18px !important;flex-shrink:0 !important;">⭐</div>';
    html += '<div style="flex:1 !important;min-width:0 !important;">';
    html += '<div style="font-size:13px !important;font-weight:800 !important;color:' + textColor + ' !important;overflow:hidden !important;text-overflow:ellipsis !important;white-space:nowrap !important;">' + safeEsc(mainProductTitle) + '</div>';
    html += '<div style="font-size:11px !important;opacity:0.65 !important;color:' + textColor + ' !important;">Producto actual</div>';
    html += '</div></div>';
    html += '<div style="font-size:13px !important;font-weight:800 !important;color:' + accentColor + ' !important;flex-shrink:0 !important;">' + fmtMoney(unitPrice) + '</div>';
    html += '</label>';

    // 2. Complementarios
    var comps = (cfg.complementary && cfg.complementary.length) ? cfg.complementary : [];
    for (var c = 0; c < comps.length; c++) {
      var cp = comps[c];
      if (cp && cp.productId) {
        var cpPrice = parseFloat(cp.productPrice || cp.price || 0) || 0;
        var isChk = cp.checkedByDefault !== false;
        html += '<label class="nvx-pc-item' + (isChk ? " selected" : "") + '">';
        html += '<div style="display:flex !important;align-items:center !important;gap:10px !important;flex:1 !important;min-width:0 !important;">';
        html += '<input type="checkbox" class="nvx-pc-chk nvx-pc-comp-chk" data-comp-id="' + cp.productId + '" data-price="' + cpPrice + '"' + (isChk ? " checked" : "") + ' onchange="window.nvxPackUpdateTotal(\'' + elementId + '\');" />';
        if (cp.productImage) {
          html += '<img src="' + safeEsc(cp.productImage) + '" class="nvx-pc-thumb" />';
        } else {
          html += '<div class="nvx-pc-thumb" style="display:flex !important;align-items:center !important;justify-content:center !important;font-size:16px !important;">📦</div>';
        }
        html += '<div style="flex:1 !important;min-width:0 !important;">';
        html += '<div style="font-size:13px !important;font-weight:700 !important;color:' + textColor + ' !important;overflow:hidden !important;text-overflow:ellipsis !important;white-space:nowrap !important;">' + safeEsc(cp.productName || "Complemento") + '</div>';
        if (cp.subtitle) {
          html += '<div style="font-size:11px !important;opacity:0.65 !important;color:' + textColor + ' !important;">' + safeEsc(cp.subtitle) + '</div>';
        }
        html += '</div></div>';
        html += '<div style="font-size:13px !important;font-weight:800 !important;color:' + accentColor + ' !important;flex-shrink:0 !important;">+' + fmtMoney(cpPrice) + '</div>';
        html += '</label>';
      }
    }

    html += '</div>';

    // Resumen Total
    html += '<div style="margin-top:8px !important;padding-top:10px !important;border-top:1px solid ' + borderColor + ' !important;display:flex !important;align-items:center !important;justify-content:space-between !important;">';
    html += '<span class="nvx-pc-items-count" style="font-size:12px !important;font-weight:700 !important;opacity:0.8 !important;color:' + textColor + ' !important;">Total:</span>';
    html += '<div style="text-align:right !important;">';
    html += '<span class="nvx-pc-subtotal" style="font-size:11px !important;text-decoration:line-through !important;opacity:0.5 !important;margin-right:6px !important;display:none !important;color:' + textColor + ' !important;"></span>';
    html += '<span class="nvx-pc-grand-total" style="font-size:16px !important;font-weight:900 !important;color:' + accentColor + ' !important;">$0</span>';
    html += '</div></div>';

    // Botón de compra
    html += '<button type="button" class="nvx-pc-btn" onclick="window.nvxPackAddToCart(this,\'' + elementId + '\',\'' + safeEsc(String(prodId)) + '\',' + (redirectCheckout ? "true" : "false") + ');">' + safeEsc(buttonText) + '</button>';

    var container = document.createElement("div");
    container.id = elementId;
    container.className = "nvx-widget nvx-pack-complementarios-wrapper";
    container.setAttribute("data-btn-text", buttonText);
    container.setAttribute("data-enable-disc", enableDiscount ? "true" : "false");
    container.setAttribute("data-disc2", String(disc2));
    container.setAttribute("data-disc3", String(disc3));
    container.setAttribute("data-disc4", String(disc4));
    container.setAttribute("data-savings-text", savingsBadgeText);
    container.innerHTML = html;

    var targetEl = null;
    var buySelectors = [
      "form[action*='/cart/add']",
      "form.js-product-form",
      ".js-product-buy-container",
      ".product-buy-container",
      "form.js-product-buyform",
      ".js-add-to-cart-btn",
      "#product_form",
      "form[action*='/cart']",
      "form[action*='/comprar']",
      ".product-form"
    ];
    for (var sIdx = 0; sIdx < buySelectors.length; sIdx++) {
      var bEl = document.querySelector(buySelectors[sIdx]);
      if (bEl) { targetEl = bEl; break; }
    }

    if (targetEl && targetEl.parentNode) {
      if (replaceCart) {
        targetEl.parentNode.insertBefore(container, targetEl);
        try { targetEl.style.display = "none"; } catch (eHide) {}
      } else {
        targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
      }
    } else {
      var main = document.querySelector("main, #content, .main-content, .js-product-container, .product-container, #single-product, .product");
      if (main) {
        main.appendChild(container);
      } else if (document.body) {
        document.body.appendChild(container);
      }
    }

    setTimeout(function () {
      if (typeof window.nvxPackUpdateTotal === "function") {
        window.nvxPackUpdateTotal(elementId);
      }
    }, 50);

    if (typeof nvxTrack === "function") {
      nvxTrack(w.id, "impression");
    }
  }

  if (typeof window.nvxPackUpdateTotal !== "function") {
    window.nvxPackUpdateTotal = function (elementId) {
      var root = document.getElementById(elementId);
      if (!root) return;

      var chks = root.querySelectorAll(".nvx-pc-chk");
      var count = 0;
      var subtotal = 0;

      for (var i = 0; i < chks.length; i++) {
        var chk = chks[i];
        var parentRow = chk.closest(".nvx-pc-item");
        if (chk.checked) {
          count++;
          subtotal += (parseFloat(chk.getAttribute("data-price") || "0") || 0);
          if (parentRow) {
            if (parentRow.className.indexOf("selected") === -1) parentRow.className += " selected";
          }
        } else {
          if (parentRow) {
            parentRow.className = String(parentRow.className).replace(/\s*selected/g, "");
          }
        }
      }

      var enableDisc = root.getAttribute("data-enable-disc") === "true";
      var disc2 = parseFloat(root.getAttribute("data-disc2") || "10") || 0;
      var disc3 = parseFloat(root.getAttribute("data-disc3") || "15") || 0;
      var disc4 = parseFloat(root.getAttribute("data-disc4") || "20") || 0;

      var discountPercent = 0;
      if (enableDisc) {
        if (count >= 4) discountPercent = disc4;
        else if (count === 3) discountPercent = disc3;
        else if (count === 2) discountPercent = disc2;
      }

      var finalTotal = discountPercent > 0 ? subtotal * (1 - discountPercent / 100) : subtotal;

      function fmt(n) {
        if (typeof window.nvxBundleFormatPrice === "function") return window.nvxBundleFormatPrice(n);
        var x = Math.round(Number(n) || 0);
        var s = String(x), out = "", c = 0;
        for (var k = s.length - 1; k >= 0; k--) {
          out = s.charAt(k) + out; c++;
          if (c === 3 && k > 0) { out = "." + out; c = 0; }
        }
        return "$" + out;
      }

      var countEl = root.querySelector(".nvx-pc-items-count");
      if (countEl) {
        countEl.innerHTML = "Total (" + count + (count === 1 ? " producto" : " productos") + "):";
      }

      var subtotalEl = root.querySelector(".nvx-pc-subtotal");
      var grandEl = root.querySelector(".nvx-pc-grand-total");
      if (subtotalEl && grandEl) {
        if (discountPercent > 0) {
          subtotalEl.style.display = "inline";
          subtotalEl.innerHTML = fmt(subtotal);
        } else {
          subtotalEl.style.display = "none";
        }
        grandEl.innerHTML = fmt(finalTotal);
      }

      var badgeEl = root.querySelector(".nvx-pc-badge");
      var rawBadgeTxt = root.getAttribute("data-savings-text") || "AHORRÁS $X";
      if (badgeEl) {
        if (discountPercent > 0) {
          badgeEl.style.display = "inline-block";
          badgeEl.innerHTML = rawBadgeTxt.replace("$X", discountPercent + "% OFF");
        } else {
          badgeEl.style.display = "none";
        }
      }

      var btn = root.querySelector(".nvx-pc-btn");
      var baseBtn = root.getAttribute("data-btn-text") || "Agregar pack al carrito";
      if (btn) {
        if (count === 0) {
          btn.disabled = true;
          btn.innerHTML = "Seleccioná al menos un producto";
        } else {
          btn.disabled = false;
          btn.innerHTML = baseBtn + " · " + fmt(finalTotal);
        }
      }
    };
  }

  if (typeof window.nvxPackAddToCart !== "function") {
    window.nvxPackAddToCart = function (btnEl, elementId, mainProdId, redirectCheckout) {
      var root = document.getElementById(elementId);
      if (!root) return;

      var origText = btnEl.getAttribute("data-orig-text") || btnEl.innerHTML;
      btnEl.setAttribute("data-orig-text", origText);
      btnEl.innerHTML = "Agregando pack...";
      btnEl.disabled = true;

      var toAdd = [];
      var mainChk = root.querySelector(".nvx-pc-main-chk");
      if (mainChk && mainChk.checked) {
        var mId = mainChk.getAttribute("data-main-id") || mainProdId;
        if (mId) toAdd.push(String(mId));
      }

      var compChks = root.querySelectorAll(".nvx-pc-comp-chk");
      for (var i = 0; i < compChks.length; i++) {
        if (compChks[i].checked) {
          var cId = compChks[i].getAttribute("data-comp-id");
          if (cId) toAdd.push(String(cId));
        }
      }

      if (toAdd.length === 0) {
        btnEl.innerHTML = origText;
        btnEl.disabled = false;
        return;
      }

      function restoreBtn() {
        btnEl.innerHTML = origText;
        btnEl.disabled = false;
      }

      function addViaNube(productId, quantity) {
        return new Promise(function (resolve) {
          try {
            if (window.nube && typeof window.nube.send === "function") {
              window.nube.send("cart:add", {
                product_id: productId,
                quantity: quantity
              });
              setTimeout(function () { resolve(true); }, 300);
              return;
            }
          } catch (e1) {}
          resolve(false);
        });
      }

      function addViaComprar(productId, quantity) {
        return new Promise(function (resolve) {
          try {
            var fd = new FormData();
            fd.append("add_to_cart", productId);
            fd.append("quantity", String(quantity));
            fetch("/comprar/", {
              method: "POST",
              body: fd,
              credentials: "include"
            }).then(function () { resolve(true); }).catch(function () { resolve(false); });
          } catch (e2) {
            resolve(false);
          }
        });
      }

      var hasNube = (typeof window !== "undefined" && window.nube && typeof window.nube.send === "function");

      if (hasNube) {
        var chain = Promise.resolve();
        for (var k = 0; k < toAdd.length; k++) {
          (function (id) {
            chain = chain.then(function () { return addViaNube(id, 1); });
          })(toAdd[k]);
        }
        chain.then(function () {
          if (redirectCheckout) {
            window.location.href = "/comprar/";
          } else {
            try { window.nube.send("cart:open"); } catch (e3) {}
            restoreBtn();
          }
        });
        return;
      }

      // Fallback sin NubeSDK: POST secuencial a /comprar/
      var fallbackChain = Promise.resolve();
      for (var j = 0; j < toAdd.length; j++) {
        (function (id2) {
          fallbackChain = fallbackChain.then(function () { return addViaComprar(id2, 1); });
        })(toAdd[j]);
      }
      fallbackChain.then(function () {
        if (redirectCheckout) {
          window.location.href = "/comprar/";
        } else {
          window.location.reload();
        }
      }).catch(function () {
        window.location.reload();
      });
    };
    }  
      /* ═══════════════════════════════════════════
   WIDGET: COMPARADOR ANTES Y DESPUÉS
   ═══════════════════════════════════════════ */
var renderComparadorAntesDespues = function(w) {
  if (!w || !w.config) return;
  var cfg = w.config || {};

  var containerId = "nvx-comparador-" + (w.id || Math.floor(Math.random() * 100000));
  if (document.getElementById(containerId)) return;

  var titulo = cfg.titulo || "";
  var subtitulo = cfg.subtitulo || "";
  var imgAntes = cfg.imagen_antes || "https://images.unsplash.com/photo-1512290900676-26c2a48f341d?auto=format&fit=crop&w=800&q=80";
  var imgDespues = cfg.imagen_despues || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80";
  var lblAntes = cfg.etiqueta_antes || "ANTES";
  var lblDespues = cfg.etiqueta_despues || "DESPUÉS";
  var showLbl = cfg.mostrar_etiquetas !== false;
  var posIni = cfg.posicion_inicial !== undefined ? cfg.posicion_inicial : 50;
  var ratio = cfg.aspect_ratio || "4/3";
  var bRadius = cfg.borde_redondeado !== undefined ? cfg.borde_redondeado : 12;
  var pTop = cfg.padding_top !== undefined ? cfg.padding_top : 16;
  var pBot = cfg.padding_bottom !== undefined ? cfg.padding_bottom : 16;
  var cSlider = cfg.color_deslizador || "#ffffff";
  var cBgLbl = cfg.color_etiqueta_fondo || "rgba(0,0,0,0.6)";
  var cTxtLbl = cfg.color_etiqueta_texto || "#ffffff";
  var ubicacion = cfg.ubicacion || "debajo_descripcion";

  var paddingAspect = "75%";
  if (ratio === "1/1") paddingAspect = "100%";
  if (ratio === "16/9") paddingAspect = "56.25%";

  var wrapper = document.createElement("div");
  wrapper.id = containerId;
  wrapper.style.cssText = "box-sizing: border-box !important; width: 100% !important; padding-top: " + pTop + "px !important; padding-bottom: " + pBot + "px !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; clear: both !important;";

  var html = "";
  if (titulo) {
    html += '<h3 style="margin: 0 0 4px 0 !important; font-size: 18px !important; font-weight: 800 !important; color: #111827 !important; text-align: center !important;">' + titulo + '</h3>';
  }
  if (subtitulo) {
    html += '<p style="margin: 0 0 16px 0 !important; font-size: 13px !important; color: #6b7280 !important; text-align: center !important;">' + subtitulo + '</p>';
  }

  html += '<div class="nvx-before-after-box" style="position: relative !important; width: 100% !important; padding-top: ' + paddingAspect + ' !important; border-radius: ' + bRadius + 'px !important; overflow: hidden !important; user-select: none !important; -webkit-user-select: none !important; box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; touch-action: none !important;">';

  // Imagen Después (Fondo)
  html += '<img src="' + imgDespues + '" alt="Después" style="position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; object-fit: cover !important; pointer-events: none !important;" />';

  // Etiqueta Después
  if (showLbl && lblDespues) {
    html += '<span style="position: absolute !important; top: 12px !important; right: 12px !important; background: ' + cBgLbl + ' !important; color: ' + cTxtLbl + ' !important; font-size: 11px !important; font-weight: 800 !important; padding: 4px 10px !important; border-radius: 6px !important; letter-spacing: 0.05em !important; z-index: 2 !important; pointer-events: none !important;">' + lblDespues + '</span>';
  }

  // Capa Antes (Recortada)
  html += '<div class="nvx-before-layer" style="position: absolute !important; top: 0 !important; left: 0 !important; bottom: 0 !important; width: ' + posIni + '% !important; overflow: hidden !important; z-index: 3 !important;">';
  html += '<img src="' + imgAntes + '" alt="Antes" style="position: absolute !important; top: 0 !important; left: 0 !important; height: 100% !important; width: 100% !important; max-width: none !important; object-fit: cover !important; pointer-events: none !important;" />';
  if (showLbl && lblAntes) {
    html += '<span style="position: absolute !important; top: 12px !important; left: 12px !important; background: ' + cBgLbl + ' !important; color: ' + cTxtLbl + ' !important; font-size: 11px !important; font-weight: 800 !important; padding: 4px 10px !important; border-radius: 6px !important; letter-spacing: 0.05em !important; pointer-events: none !important; white-space: nowrap !important;">' + lblAntes + '</span>';
  }
  html += '</div>';

  // Barra / Mango
  html += '<div class="nvx-divider-handle" style="position: absolute !important; top: 0 !important; bottom: 0 !important; left: ' + posIni + '% !important; width: 2px !important; background: ' + cSlider + ' !important; transform: translateX(-50%) !important; z-index: 4 !important; pointer-events: none !important; box-shadow: 0 0 8px rgba(0,0,0,0.4) !important;">';
  html += '<div style="position: absolute !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; width: 36px !important; height: 36px !important; border-radius: 50% !important; background: ' + cSlider + ' !important; box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important; display: flex !important; align-items: center !important; justify-content: center !important; color: #333 !important; font-size: 14px !important; font-weight: bold !important;">↔</div>';
  html += '</div>';

  html += '</div>';

  wrapper.innerHTML = html;

  // Inserción en el DOM
  var targetEl = null;
  if (ubicacion === "debajo_boton_comprar") {
    targetEl = document.querySelector("form[action*='/cart/add'], .js-addtocart, .btn-add-to-cart, .js-product-form");
  } else if (ubicacion === "encima_comentarios") {
    targetEl = document.querySelector("#reviews, .js-reviews-container, .comments, #comments");
  }

  if (!targetEl) {
    targetEl = document.querySelector(".js-product-description, .product-description, .description, #description");
  }

  if (targetEl && targetEl.parentNode) {
    targetEl.parentNode.insertBefore(wrapper, targetEl.nextSibling);
  } else {
    var mainProduct = document.querySelector(".js-product-container, .product-detail, form[action*='/cart/add']") || document.body;
    mainProduct.appendChild(wrapper);
  }

  // Lógica del deslizador
  var box = wrapper.querySelector(".nvx-before-after-box");
  var beforeLayer = wrapper.querySelector(".nvx-before-layer");
  var dividerHandle = wrapper.querySelector(".nvx-divider-handle");

  if (box && beforeLayer && dividerHandle) {
    var isDragging = false;

    var updatePos = function(clientX) {
      var rect = box.getBoundingClientRect();
      var x = clientX - rect.left;
      var pct = (x / rect.width) * 100;
      if (pct < 0) pct = 0;
      if (pct > 100) pct = 100;

      beforeLayer.style.width = pct + "%";
      dividerHandle.style.left = pct + "%";
    };

    var onStart = function(e) {
      isDragging = true;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updatePos(clientX);
    };

    var onMove = function(e) {
      if (!isDragging) return;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updatePos(clientX);
    };

    var onEnd = function() {
      isDragging = false;
    };

    box.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);

    box.addEventListener("touchstart", onStart);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);
  }
};
              /* ═══════════════════════════════════════════
   WIDGET: BENEFICIOS (v127)
   ═══════════════════════════════════════════ */
var renderBeneficios = function(w) {
  var pType = typeof detectPageType === "function" ? detectPageType() : "";
  var isProductPage = pType === "product" || pType === "item";

  if (!isProductPage) return;
  if (document.getElementById("nvx-beneficios-product")) return;

  var cfg = w.config || {};

  // Presets de Campañas / Fechas especiales
  var presets = {
    "black-friday": { fondo: "#111827", titulo: "#ffffff", texto: "#f3f4f6", borde: "#F59E0B" },
    "hot-sale": { fondo: "#0F172A", titulo: "#ffffff", texto: "#e2e8f0", borde: "#3B82F6" },
    "cyber-monday": { fondo: "#090D16", titulo: "#ffffff", texto: "#cbd5e1", borde: "#10B981" },
    "navidad": { fondo: "#064E3B", titulo: "#ffffff", texto: "#ecfdf5", borde: "#EF4444" },
    "san-valentin": { fondo: "#fdf2f8", titulo: "#831843", texto: "#9d174d", borde: "#F43F5E" },
    "dia-padre-madre": { fondo: "#312E81", titulo: "#ffffff", texto: "#e0e7ff", borde: "#10B981" },
    "liquidacion": { fondo: "#7F1D1D", titulo: "#ffffff", texto: "#fef2f2", borde: "#FBBF24" }
  };

  var theme = cfg.campaignTheme || "none";
  var presetTheme = presets[theme] || null;

  // Helper Markdown: convierte **texto** en <strong>texto</strong>
  var formatMarkdown = function(text) {
    if (!text) return "";
    return String(text).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  };

  // 1. Título y textos
  var rawTitulo = cfg.titulo !== undefined ? cfg.titulo : (cfg.title || "¿Por qué elegirnos?");
  var titulo = String(rawTitulo).trim();

  var defaultItems = [
    { id: "1", icon: "🚚", text: "Envío **gratis** a todo el país" },
    { id: "2", icon: "🔒", text: "Pago **seguro** y protegido" },
    { id: "3", icon: "✅", text: "Garantía de **satisfacción**" }
  ];

  var items = (cfg.items && cfg.items.length > 0) ? cfg.items : defaultItems;

  // 2. Colores (Prioriza preset de campaña si está activo, sino usa los de Estilos)
  var colorFondo = presetTheme ? presetTheme.fondo : (cfg.color_fondo || cfg.bgColor || "#ffffff");
  var colorTitulo = presetTheme ? presetTheme.titulo : (cfg.color_titulo || cfg.titleColor || "#111827");
  var colorTexto = presetTheme ? presetTheme.texto : (cfg.color_texto || cfg.textColor || "#374151");
  var colorBorde = presetTheme ? presetTheme.borde : (cfg.color_borde || cfg.borderColor || "#e5e7eb");

  // 3. Tipografías y tamaños
  var tamTextoMap = { pequeno: "12px", mediano: "14px", grande: "16px" };
  var tamIconoMap = { pequeno: "16px", mediano: "20px", grande: "24px" };

  var fontSize = tamTextoMap[cfg.tamano_texto] || (cfg.fontSize ? cfg.fontSize + "px" : "14px");
  var titleFontSize = (parseInt(fontSize, 10) + 2) + "px";
  var iconSize = tamIconoMap[cfg.tamano_icono] || (cfg.iconSize ? cfg.iconSize + "px" : "20px");
  var isBold = (cfg.estilo_texto === "resaltado" || !!cfg.isBold);
  var fontWeight = isBold ? "700" : "500";

  // 4. Medidas y bordes
  var borderRadius = (cfg.borde_redondeado !== undefined ? cfg.borde_redondeado : (cfg.borderRadius !== undefined ? cfg.borderRadius : 12)) + "px";
  var padding = (cfg.padding !== undefined ? cfg.padding : 16) + "px";
  var marginTop = (cfg.margin_top !== undefined ? cfg.margin_top : (cfg.marginTop !== undefined ? cfg.marginTop : 16)) + "px";
  var marginBottom = (cfg.margin_bottom !== undefined ? cfg.margin_bottom : (cfg.marginBottom !== undefined ? cfg.marginBottom : 16)) + "px";
  var ubicacion = cfg.ubicacion || cfg.position || "debajo_precio";

  // 5. Construcción del contenedor
  var container = document.createElement("div");
  container.id = "nvx-beneficios-product";

  var css = "box-sizing: border-box !important; " +
            "width: 100% !important; " +
            "max-width: 100% !important; " +
            "background: " + colorFondo + " !important; " +
            "padding: " + padding + " !important; " +
            "border-radius: " + borderRadius + " !important; " +
            "margin-top: " + marginTop + " !important; " +
            "margin-bottom: " + marginBottom + " !important; " +
            "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important; " +
            "clear: both !important; " +
            "box-shadow: 0 2px 8px rgba(0,0,0,0.03) !important; ";

  if (colorBorde && colorBorde !== "transparent") {
    css += "border: 1.5px solid " + colorBorde + " !important; ";
  } else {
    css += "border: none !important; ";
  }

  container.style.cssText = css;

  // 6. Armado del HTML interno
  var html = "";

  if (titulo) {
    html += '<div style="font-size: ' + titleFontSize + ' !important; font-weight: 800 !important; color: ' + colorTitulo + ' !important; margin-bottom: 12px !important; line-height: 1.3 !important;">' +
              formatMarkdown(titulo) +
            '</div>';
  }

  html += '<div style="display: flex !important; flex-direction: column !important; gap: 10px !important;">';

  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    if (!it) continue;

    var iconStr = it.icon || "✅";
    var textStr = it.text || "";
    if (!textStr) continue;

    html += '<div style="display: flex !important; align-items: center !important; gap: 10px !important; line-height: 1.35 !important;">' +
              '<span style="font-size: ' + iconSize + ' !important; line-height: 1 !important; flex-shrink: 0 !important; display: inline-flex !important; align-items: center !important; justify-content: center !important;">' +
                iconStr +
              '</span>' +
              '<span style="font-size: ' + fontSize + ' !important; color: ' + colorTexto + ' !important; font-weight: ' + fontWeight + ' !important;">' +
                formatMarkdown(textStr) +
              '</span>' +
            '</div>';
  }

  html += '</div>';
  container.innerHTML = html;

  // 7. Inserción en el DOM según la ubicación configurada
  var inserted = false;

  // Opción: Por encima del formulario de compra
  if (ubicacion === "encima_formulario" || ubicacion === "above_form") {
    var formEl = document.querySelector("form[action*='/cart/add'], .js-product-form, .product-form, .js-addtocart");
    if (formEl && formEl.parentNode) {
      formEl.parentNode.insertBefore(container, formEl);
      inserted = true;
    }
  }

  // Opción: Debajo del precio (o fallback)
  if (!inserted) {
    var priceBlock = document.querySelector(
      ".js-price-container, .js-product-price-container, .product-price-container, .price-container, .js-item-price, [data-store='product-price']"
    );

    if (priceBlock && priceBlock.parentNode) {
      var parentBlock = priceBlock.closest
        ? (priceBlock.closest(".js-price-container, .js-product-price-container, .product-price-container, .price-container") || priceBlock.parentNode)
        : priceBlock.parentNode;

      if (parentBlock && parentBlock.parentNode && parentBlock !== document.body) {
        parentBlock.parentNode.insertBefore(container, parentBlock.nextSibling);
        inserted = true;
      } else if (priceBlock.parentNode) {
        priceBlock.parentNode.insertBefore(container, priceBlock.nextSibling);
        inserted = true;
      }
    }
  }

  // Fallback directo por selector de precio
  if (!inserted) {
    var allPrices = document.querySelectorAll(".js-price-display, #price_display, .js-product-price");
    if (allPrices && allPrices.length > 0) {
      var lastP = allPrices[allPrices.length - 1];
      var wrap = lastP.parentNode;
      if (wrap && wrap.parentNode && wrap.parentNode !== document.body) {
        wrap.parentNode.insertBefore(container, wrap.nextSibling);
      } else if (wrap) {
        wrap.insertBefore(container, lastP.nextSibling);
      }
      inserted = true;
    }
  }

  // Fallback final general
  if (!inserted) {
    var fallbackForm = document.querySelector("form[action*='/cart/add'], .js-product-form, .product-form");
    if (fallbackForm && fallbackForm.parentNode) {
      fallbackForm.parentNode.insertBefore(container, fallbackForm);
    } else {
      var mainWrap = document.querySelector(".js-product-detail, .product-detail, main, #single-product");
      if (mainWrap) {
        mainWrap.appendChild(container);
      }
    }
  }
};
  /* ═══════════════════════════════════════════
   WIDGET: TABLA DE TALLES (v143 - Vanilla ES5 Estricto)
   Modal Guía Informativa 100% Limpio y Seguro
   ═══════════════════════════════════════════ */
var renderTablaTalles = function(w) {
  var pType = typeof detectPageType === "function" ? detectPageType() : "";
  var isProductPage = pType === "product" || pType === "item";

  if (!isProductPage) return;
  if (document.getElementById("nvx-tabla-talles-btn")) return;

  var cfg = w.config || {};

  var textoBoton = cfg.texto_boton || "Tabla de talles";
  var tituloHeader = cfg.titulo_header || "Guía de talles";
  var mostrarIcono = !!cfg.mostrar_icono_regla;
  var mostrarImagen = !!cfg.mostrar_imagen;
  var mostrarTabla = cfg.mostrar_tabla !== false;
  var mostrarTexto = !!cfg.mostrar_texto;
  var orden = cfg.orden_contenido || "imagen_tabla_texto";
  var imagenUrl = cfg.imagen_url || "";
  var textoInfo = cfg.texto_info || "";
  var ubicacion = cfg.ubicacion || "despues_precio";

  var celdas = cfg.celdas || [];
  if (!celdas || celdas.length === 0) {
    celdas = [
      ["Talle", "Pecho (cm)", "Cintura (cm)", "Cadera (cm)"],
      ["XS", "82-86", "62-66", "86-90"],
      ["S", "86-90", "66-70", "90-94"],
      ["M", "90-94", "70-74", "94-98"],
      ["L", "94-100", "74-80", "98-104"],
      ["XL", "100-106", "80-86", "104-110"]
    ];
  }

  var tipoFondo = cfg.tipo_fondo || "solido";
  var colorFondo1 = cfg.color_fondo || "#111827";
  var colorFondo2 = cfg.color_fondo_2 || "#374151";
  var colorTextoBoton = cfg.color_texto_boton || "#ffffff";
  var colorTextoHeader = cfg.color_texto_header || "#111827";

  var tamanoTexto = (cfg.tamano_texto || 14) + "px";
  var bordeBoton = (cfg.borde_boton !== undefined ? cfg.borde_boton : 25) + "px";
  var paddingBoton = (cfg.padding_boton !== undefined ? cfg.padding_boton : 12) + "px " + ((cfg.padding_boton || 12) + 12) + "px";
  var marginTop = (cfg.margin_top !== undefined ? cfg.margin_top : 10) + "px";
  var marginBottom = (cfg.margin_bottom !== undefined ? cfg.margin_bottom : 15) + "px";

  var bgStyle = tipoFondo === "degrade"
    ? "linear-gradient(135deg, " + colorFondo1 + ", " + colorFondo2 + ")"
    : colorFondo1;

  // 1. Crear el botón del widget
  var btn = document.createElement("button");
  btn.id = "nvx-tabla-talles-btn";
  btn.type = "button";
  btn.style.cssText = "box-sizing: border-box !important; " +
                     "display: inline-flex !important; " +
                     "align-items: center !important; " +
                     "justify-content: center !important; " +
                     "gap: 8px !important; " +
                     "background: " + bgStyle + " !important; " +
                     "color: " + colorTextoBoton + " !important; " +
                     "border: none !important; " +
                     "border-radius: " + bordeBoton + " !important; " +
                     "padding: " + paddingBoton + " !important; " +
                     "font-size: " + tamanoTexto + " !important; " +
                     "font-weight: 700 !important; " +
                     "cursor: pointer !important; " +
                     "margin-top: " + marginTop + " !important; " +
                     "margin-bottom: " + marginBottom + " !important; " +
                     "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; " +
                     "box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important; " +
                     "transition: opacity 0.2s !important; ";

  var btnHtml = "";
  if (mostrarIcono) {
    btnHtml += '<span style="font-size: ' + (parseInt(tamanoTexto, 10) + 2) + 'px !important; line-height: 1 !important;">📏</span>';
  }
  btnHtml += '<span>' + textoBoton + '</span>';
  btn.innerHTML = btnHtml;

  btn.onmouseover = function() { btn.style.opacity = "0.9"; };
  btn.onmouseout = function() { btn.style.opacity = "1"; };

  // 2. Inserción del botón en la página del producto
  var inserted = false;

  if (ubicacion === "despues_info_pago") {
    var payBlock = document.querySelector(
      ".js-max-installments-container, .installments-container, .js-installments-container, [data-store='installments'], .payment-details"
    );
    if (payBlock && payBlock.parentNode) {
      payBlock.parentNode.insertBefore(btn, payBlock.nextSibling);
      inserted = true;
    }
  }

  if (!inserted) {
    var priceBlock = document.querySelector(
      ".js-price-container, .js-product-price-container, .product-price-container, .price-container, .js-item-price, [data-store='product-price']"
    );
    if (priceBlock && priceBlock.parentNode) {
      var parentBlock = priceBlock.closest
        ? (priceBlock.closest(".js-price-container, .js-product-price-container, .product-price-container, .price-container") || priceBlock.parentNode)
        : priceBlock.parentNode;

      if (parentBlock && parentBlock.parentNode && parentBlock !== document.body) {
        parentBlock.parentNode.insertBefore(btn, parentBlock.nextSibling);
        inserted = true;
      } else if (priceBlock.parentNode) {
        priceBlock.parentNode.insertBefore(btn, priceBlock.nextSibling);
        inserted = true;
      }
    }
  }

  if (!inserted) {
    var formEl = document.querySelector("form[action*='/cart/add'], form[action*='/comprar'], .js-product-form, .product-form");
    if (formEl && formEl.parentNode) {
      formEl.parentNode.insertBefore(btn, formEl);
    } else {
      document.body.appendChild(btn);
    }
  }

  // 3. Construcción del contenido del Modal
  var buildModalContent = function() {
    var imgHtml = "";
    if (mostrarImagen && imagenUrl) {
      imgHtml = '<div style="margin-bottom: 14px !important; text-align: center !important;">' +
                  '<img src="' + imagenUrl + '" alt="Guía de talles" style="max-width: 100% !important; height: auto !important; border-radius: 8px !important; border: 1px solid #e5e7eb !important;" />' +
                '</div>';
    }

    var tableHtml = "";
    if (mostrarTabla && celdas && celdas.length > 0) {
      tableHtml = '<div style="overflow-x: auto !important; margin-bottom: 14px !important; border: 1px solid #e5e7eb !important; border-radius: 8px !important; background: #ffffff !important;">' +
                    '<table style="width: 100% !important; border-collapse: collapse !important; font-size: 13px !important; text-align: center !important;">' +
                      '<tbody>';

      for (var r = 0; r < celdas.length; r++) {
        var row = celdas[r];
        tableHtml += '<tr style="' + (r === 0 ? "background: #f3f4f6 !important; font-weight: 700 !important; color: #111827 !important;" : "border-top: 1px solid #e5e7eb !important;") + '">';
        for (var c = 0; c < row.length; c++) {
          var cellVal = row[c] !== undefined ? row[c] : "";
          tableHtml += '<td style="padding: 8px 10px !important; ' + (c === 0 && r !== 0 ? "background: #f9fafb !important; font-weight: 700 !important;" : "") + '">' +
                          cellVal +
                       '</td>';
        }
        tableHtml += '</tr>';
      }

      tableHtml += '</tbody></table></div>';
    }

    var textHtml = "";
    if (mostrarTexto && textoInfo) {
      textHtml = '<div style="font-size: 13px !important; color: #4b5563 !important; line-height: 1.5 !important; margin-bottom: 14px !important; background: #f9fafb !important; padding: 10px 12px !important; border-radius: 8px !important; border: 1px solid #f3f4f6 !important;">' +
                   textoInfo.replace(/\n/g, "<br/>") +
                 '</div>';
    }

    var orderMap = {
      "imagen_tabla_texto": [imgHtml, tableHtml, textHtml],
      "tabla_imagen_texto": [tableHtml, imgHtml, textHtml],
      "texto_tabla_imagen": [textHtml, tableHtml, imgHtml],
      "imagen_texto_tabla": [imgHtml, textHtml, tableHtml],
      "tabla_texto_imagen": [tableHtml, textHtml, imgHtml],
      "texto_imagen_tabla": [textHtml, imgHtml, tableHtml]
    };

    var parts = orderMap[orden] || [imgHtml, tableHtml, textHtml];
    return parts.join("");
  };

  // 4. Lógica de Apertura del Modal
  btn.onclick = function() {
    var existingModal = document.getElementById("nvx-tabla-talles-modal");
    if (existingModal) {
      existingModal.style.display = "flex";
      return;
    }

    var overlay = document.createElement("div");
    overlay.id = "nvx-tabla-talles-modal";
    overlay.style.cssText = "position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(0,0,0,0.6) !important; z-index: 999999 !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 16px !important; box-sizing: border-box !important; backdrop-filter: blur(2px) !important;";

    var modal = document.createElement("div");
    modal.style.cssText = "background: #ffffff !important; border-radius: 16px !important; width: 100% !important; max-width: 500px !important; max-height: 85vh !important; display: flex !important; flex-direction: column !important; box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important; overflow: hidden !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;";

    // Header del Modal
    var header = document.createElement("div");
    header.style.cssText = "display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 16px 20px !important; border-bottom: 1px solid #e5e7eb !important; flex-shrink: 0 !important;";
    header.innerHTML = '<div style="font-size: 16px !important; font-weight: 800 !important; color: ' + colorTextoHeader + ' !important;">' + tituloHeader + '</div>' +
                       '<button type="button" id="nvx-close-talles-modal" style="background: none !important; border: none !important; font-size: 20px !important; color: #6b7280 !important; cursor: pointer !important; padding: 0 4px !important; line-height: 1 !important;">✕</button>';

    // Body del Modal
    var body = document.createElement("div");
    body.style.cssText = "padding: 20px !important; overflow-y: auto !important; box-sizing: border-box !important; flex: 1 !important;";
    body.innerHTML = buildModalContent();

    modal.appendChild(header);
    modal.appendChild(body);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Eventos de Cierre
    var closeModal = function() {
      overlay.style.display = "none";
    };

    var closeBtn = document.getElementById("nvx-close-talles-modal");
    if (closeBtn) closeBtn.onclick = closeModal;

    overlay.onclick = function(e) {
      if (e.target === overlay) closeModal();
    };

    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape") closeModal();
    });
  };
};
  /* ═════════════════════════════════════════════════════════════════════
   WIDGET #27: PROBADOR VIRTUAL (v147 - MediaPipe Live Tracking)
   ═════════════════════════════════════════════════════════════════════ */
var openProbadorModal = function(widget, productImgUrl) {
  var cfg = widget.config || {};
  var tituloModal = cfg.titulo_modal || "Probador virtual";
  var habilitarCamara = cfg.habilitar_camara !== false;
  var habilitarSubir = cfg.habilitar_subir_imagen !== false;
  var habilitarRotar = !!cfg.habilitar_rotar;

  var existing = document.getElementById("nevux-pv-modal-overlay");
  if (existing && existing.parentNode) {
    existing.parentNode.removeChild(existing);
  }

  // Estado
  var mediaStream = null;
  var facingMode = "user";
  var isFrozenPhoto = false;
  var trackingRAF = null;
  var faceLandmarker = null;
  var poseLandmarker = null;
  var mpReady = false;

  // Offsets manuales
  var userX = 0;
  var userY = 0;
  var userScale = 1.0;
  var userRot = 0;

  // Offsets AI (actualizados por el loop)
  var autoX = 0;
  var autoY = 0;
  var autoScale = 1.0;
  var autoRot = 0;

  var currentVideo = null;
  var currentStage = null;

  // Clasificación del producto por nombre
  var detectCategory = function() {
    var productName = "";
    if (window.LS && window.LS.product && window.LS.product.name) {
      productName = String(window.LS.product.name).toLowerCase();
    } else {
      var h1 = document.querySelector("h1, .product-name, .js-product-name");
      if (h1) productName = (h1.textContent || h1.innerText || "").toLowerCase();
    }

    if (/anteojo|lente|gafa|sunglass|optica/i.test(productName)) return "glasses";
    if (/gorro|sombrero|cap|visera|vincha|gorra|boina|casco|hat/i.test(productName)) return "hat";
    if (/collar|cadena|gargantilla|dije|necklace/i.test(productName)) return "necklace";
    if (/corrector|postura|espalda|faja|chaleco|remera|buzo|chomba|camisa|vest/i.test(productName)) return "torso";
    if (/reloj|pulsera|brazalete|watch|bracelet/i.test(productName)) return "wrist";
    return "face";
  };

  var productCategory = detectCategory();
  var usesPose = (productCategory === "torso" || productCategory === "wrist");

  /* ─── Carga de MediaPipe Tasks Vision desde CDN ─── */
  var ensureMediaPipe = function(callback) {
    if (mpReady) { callback(); return; }

    try {
      import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs")
        .then(function(vision) {
          var FilesetResolver = vision.FilesetResolver;
          var FaceLandmarker = vision.FaceLandmarker;
          var PoseLandmarker = vision.PoseLandmarker;

          FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm")
            .then(function(fileset) {
              var tasks = [];

              if (!usesPose) {
                tasks.push(FaceLandmarker.createFromOptions(fileset, {
                  baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                    delegate: "GPU"
                  },
                  outputFaceBlendshapes: false,
                  runningMode: "VIDEO",
                  numFaces: 1
                }).then(function(fl) { faceLandmarker = fl; }));
              } else {
                tasks.push(PoseLandmarker.createFromOptions(fileset, {
                  baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
                    delegate: "GPU"
                  },
                  runningMode: "VIDEO",
                  numPoses: 1
                }).then(function(pl) { poseLandmarker = pl; }));
              }

              Promise.all(tasks).then(function() {
                mpReady = true;
                callback();
              }).catch(function() { callback(); });
            }).catch(function() { callback(); });
        }).catch(function() { callback(); });
    } catch (err) {
      callback();
    }
  };

  /* ─── Loop de tracking en vivo ─── */
  var stopTracking = function() {
    if (trackingRAF) {
      cancelAnimationFrame(trackingRAF);
      trackingRAF = null;
    }
  };

  var smooth = function(prev, next, factor) {
    return prev + (next - prev) * factor;
  };

  var runTrackingLoop = function(videoEl, stageEl) {
    if (!videoEl || !stageEl) return;
    if (videoEl.readyState < 2) {
      trackingRAF = requestAnimationFrame(function() { runTrackingLoop(videoEl, stageEl); });
      return;
    }

    var stageRect = stageEl.getBoundingClientRect();
    var stageW = stageRect.width;
    var stageH = stageRect.height;

    var ts = performance.now();

    try {
      if (faceLandmarker && !usesPose) {
        var faceResult = faceLandmarker.detectForVideo(videoEl, ts);
        if (faceResult && faceResult.faceLandmarks && faceResult.faceLandmarks[0]) {
          var lm = faceResult.faceLandmarks[0];
          // Puntos clave:
          // 10 = frente arriba, 152 = mentón, 234 = lado izq, 454 = lado der,
          // 168 = entrecejo (nariz top), 2 = punta nariz, 33/263 = ojos
          var top = lm[10];
          var chin = lm[152];
          var leftC = lm[234];
          var rightC = lm[454];
          var noseTop = lm[168];
          var leftEye = lm[33];
          var rightEye = lm[263];

          // Reflejar X si cámara frontal (video espejado)
          var mirror = (facingMode === "user") ? -1 : 1;

          var faceW = Math.abs(rightC.x - leftC.x) * stageW;
          var faceH = Math.abs(chin.y - top.y) * stageH;

          var centerX = ((leftC.x + rightC.x) / 2) * stageW;
          var centerY = ((top.y + chin.y) / 2) * stageH;

          // Rotación aproximada basada en inclinación de ojos
          var dxEye = (rightEye.x - leftEye.x) * stageW;
          var dyEye = (rightEye.y - leftEye.y) * stageH;
          var angleDeg = Math.atan2(dyEye, dxEye) * 180 / Math.PI;

          var targetX = 0;
          var targetY = 0;
          var targetScale = 1;
          var targetRot = angleDeg;

          if (productCategory === "hat") {
            // Encima de la frente
            var topY = top.y * stageH;
            targetX = (centerX - stageW / 2) * mirror * -1;
            targetY = topY - stageH / 2 - faceH * 0.45;
            targetScale = (faceW / stageW) * 2.2;
          } else if (productCategory === "glasses") {
            // En los ojos
            var eyeCenterY = ((leftEye.y + rightEye.y) / 2) * stageH;
            var eyeCenterX = ((leftEye.x + rightEye.x) / 2) * stageW;
            targetX = (eyeCenterX - stageW / 2) * mirror * -1;
            targetY = eyeCenterY - stageH / 2;
            targetScale = (faceW / stageW) * 1.8;
          } else if (productCategory === "necklace") {
            // Debajo del mentón
            var chinY = chin.y * stageH;
            targetX = (centerX - stageW / 2) * mirror * -1;
            targetY = chinY - stageH / 2 + faceH * 0.5;
            targetScale = (faceW / stageW) * 2.0;
          } else {
            // face por defecto: centrado en la cara
            targetX = (centerX - stageW / 2) * mirror * -1;
            targetY = centerY - stageH / 2;
            targetScale = (faceW / stageW) * 1.6;
          }

          autoX = smooth(autoX, targetX, 0.35);
          autoY = smooth(autoY, targetY, 0.35);
          autoScale = smooth(autoScale, targetScale, 0.3);
          autoRot = smooth(autoRot, targetRot, 0.25);
          updateProductTransform();
        }
      } else if (poseLandmarker && usesPose) {
        var poseResult = poseLandmarker.detectForVideo(videoEl, ts);
        if (poseResult && poseResult.landmarks && poseResult.landmarks[0]) {
          var pl = poseResult.landmarks[0];
          var mirror2 = (facingMode === "user") ? -1 : 1;

          // 11 = hombro izq, 12 = hombro der, 23 = cadera izq, 24 = cadera der
          // 15 = muñeca izq, 16 = muñeca der
          var lSh = pl[11];
          var rSh = pl[12];
          var lHip = pl[23];
          var rHip = pl[24];
          var rWrist = pl[16];

          if (productCategory === "torso" && lSh && rSh && lHip && rHip) {
            var shouldersX = ((lSh.x + rSh.x) / 2) * stageW;
            var shouldersY = ((lSh.y + rSh.y) / 2) * stageH;
            var hipsY = ((lHip.y + rHip.y) / 2) * stageH;
            var shoulderW = Math.abs(rSh.x - lSh.x) * stageW;
            var torsoH = Math.abs(hipsY - shouldersY);
            var torsoCenterY = (shouldersY + hipsY) / 2;

            var dxSh = (rSh.x - lSh.x) * stageW;
            var dySh = (rSh.y - lSh.y) * stageH;
            var torsoAngle = Math.atan2(dySh, dxSh) * 180 / Math.PI;

            var targetXT = (shouldersX - stageW / 2) * mirror2 * -1;
            var targetYT = torsoCenterY - stageH / 2;
            var targetScaleT = (shoulderW / stageW) * 2.4;

            autoX = smooth(autoX, targetXT, 0.3);
            autoY = smooth(autoY, targetYT, 0.3);
            autoScale = smooth(autoScale, targetScaleT, 0.25);
            autoRot = smooth(autoRot, torsoAngle, 0.2);
            updateProductTransform();
          } else if (productCategory === "wrist" && rWrist) {
            var wristX = rWrist.x * stageW;
            var wristY = rWrist.y * stageH;

            var targetXW = (wristX - stageW / 2) * mirror2 * -1;
            var targetYW = wristY - stageH / 2;
            var targetScaleW = 0.4;

            autoX = smooth(autoX, targetXW, 0.4);
            autoY = smooth(autoY, targetYW, 0.4);
            autoScale = smooth(autoScale, targetScaleW, 0.3);
            autoRot = smooth(autoRot, 0, 0.2);
            updateProductTransform();
          }
        }
      }
    } catch (eDetect) {}

    trackingRAF = requestAnimationFrame(function() { runTrackingLoop(videoEl, stageEl); });
  };

  /* ─── Overlay y Modal ─── */
  var overlay = document.createElement("div");
  overlay.id = "nevux-pv-modal-overlay";
  overlay.style.cssText = "position: fixed !important; top: 0 !important; left: 0 !important; " +
                          "width: 100vw !important; height: 100vh !important; " +
                          "background: rgba(0,0,0,0.85) !important; z-index: 999999 !important; " +
                          "display: flex !important; flex-direction: column !important; " +
                          "align-items: center !important; justify-content: center !important; " +
                          "padding: 10px !important; box-sizing: border-box !important; " +
                          "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;";

  var modal = document.createElement("div");
  modal.style.cssText = "background: #111827 !important; color: #ffffff !important; " +
                        "border-radius: 16px !important; width: 100% !important; " +
                        "max-width: 480px !important; height: 90vh !important; max-height: 720px !important; " +
                        "display: flex !important; flex-direction: column !important; " +
                        "box-shadow: 0 12px 32px rgba(0,0,0,0.5) !important; " +
                        "overflow: hidden !important; position: relative !important;";

  var header = document.createElement("div");
  header.style.cssText = "display: flex !important; align-items: center !important; " +
                         "justify-content: space-between !important; padding: 14px 18px !important; " +
                         "border-bottom: 1px solid rgba(255,255,255,0.1) !important; flex-shrink: 0 !important; " +
                         "background: #111827 !important;";

  header.innerHTML = '<div style="font-size: 16px !important; font-weight: 800 !important; color: #ffffff !important; display: flex !important; align-items: center !important; gap: 8px !important;">' +
                     tituloModal +
                     ' <span id="nevux-pv-ai-badge" style="font-size: 9px !important; background: #10B981 !important; color: #fff !important; padding: 2px 7px !important; border-radius: 999px !important; font-weight: 900 !important; display: none !important;">AI</span>' +
                     '</div>' +
                     '<button type="button" id="nevux-pv-close-btn" style="background: none !important; border: none !important; ' +
                     'font-size: 22px !important; color: #ffffff !important; cursor: pointer !important; opacity: 0.8 !important; padding: 0 4px !important; line-height: 1 !important;">✕</button>';

  var content = document.createElement("div");
  content.id = "nevux-pv-content";
  content.style.cssText = "flex: 1 !important; display: flex !important; flex-direction: column !important; " +
                          "align-items: center !important; justify-content: center !important; " +
                          "position: relative !important; overflow: hidden !important; background: #000000 !important;";

  modal.appendChild(header);
  modal.appendChild(content);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  var stopCamera = function() {
    stopTracking();
    if (mediaStream) {
      try {
        var tracks = mediaStream.getTracks();
        for (var t = 0; t < tracks.length; t++) {
          tracks[t].stop();
        }
      } catch (err) {}
      mediaStream = null;
    }
  };

  var closeModal = function() {
    stopCamera();
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  };

  var closeBtn = document.getElementById("nevux-pv-close-btn");
  if (closeBtn) closeBtn.onclick = closeModal;

  overlay.onclick = function(e) {
    if (e.target === overlay) closeModal();
  };

  var updateProductTransform = function() {
    var prodImg = document.getElementById("nevux-pv-prod-overlay");
    if (prodImg) {
      var totalX = autoX + userX;
      var totalY = autoY + userY;
      var totalScale = Math.max(0.1, autoScale * userScale);
      var totalRot = autoRot + userRot;

      prodImg.style.transform = "translate(-50%, -50%) translate(" + totalX + "px, " + totalY + "px) scale(" + totalScale + ") rotate(" + totalRot + "deg)";
    }
  };

  var applyCategoryDefaults = function() {
    autoX = 0;
    if (productCategory === "hat") { autoY = -70; autoScale = 0.9; }
    else if (productCategory === "glasses") { autoY = -35; autoScale = 0.6; }
    else if (productCategory === "necklace") { autoY = 40; autoScale = 0.75; }
    else if (productCategory === "torso") { autoY = 60; autoScale = 1.1; }
    else if (productCategory === "wrist") { autoY = 80; autoScale = 0.5; }
    else { autoY = 0; autoScale = 0.85; }
    autoRot = 0;
    updateProductTransform();
  };

  var captureCurrentFrame = function(videoEl) {
    try {
      stopTracking();
      var canvas = document.createElement("canvas");
      canvas.width = videoEl.videoWidth || videoEl.clientWidth || 640;
      canvas.height = videoEl.videoHeight || videoEl.clientHeight || 480;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

      var img = document.createElement("img");
      img.src = canvas.toDataURL("image/jpeg", 0.9);
      stopCamera();
      isFrozenPhoto = true;
      renderTryOnView(img);
    } catch(errCap) {}
  };

  var renderTryOnView = function(bgElement) {
    content.innerHTML = "";
    currentVideo = (bgElement && bgElement.tagName === "VIDEO") ? bgElement : null;

    var stage = document.createElement("div");
    stage.id = "nevux-pv-stage";
    stage.style.cssText = "width: 100% !important; flex: 1 !important; position: relative !important; " +
                          "overflow: hidden !important; background: #000000 !important; " +
                          "display: flex !important; align-items: center !important; justify-content: center !important;";
    currentStage = stage;

    bgElement.style.cssText = "width: 100% !important; height: 100% !important; object-fit: cover !important; position: absolute !important; top: 0 !important; left: 0 !important;";
    if (currentVideo && facingMode === "user") {
      bgElement.style.transform = "scaleX(-1)";
    }
    stage.appendChild(bgElement);

    if (productImgUrl) {
      var prodImg = document.createElement("img");
      prodImg.id = "nevux-pv-prod-overlay";
      prodImg.src = productImgUrl;
      prodImg.style.cssText = "position: absolute !important; top: 50% !important; left: 50% !important; " +
                              "max-width: 65% !important; max-height: 65% !important; width: auto !important; height: auto !important; " +
                              "object-fit: contain !important; pointer-events: none !important; z-index: 10 !important; " +
                              "transition: transform 0.08s linear !important; " +
                              "filter: drop-shadow(0 4px 10px rgba(0,0,0,0.4)) !important; " +
                              "transform: translate(-50%, -50%) !important;";
      stage.appendChild(prodImg);
    }

    content.appendChild(stage);

    // Controles
    var controlsBar = document.createElement("div");
    controlsBar.style.cssText = "width: 100% !important; background: #ffffff !important; " +
                                "border-top: 1px solid #e5e7eb !important; padding: 12px 10px !important; " +
                                "display: flex !important; flex-direction: column !important; gap: 8px !important; " +
                                "align-items: center !important; flex-shrink: 0 !important; box-sizing: border-box !important;";

    var pillBtnStyle = "background: #1f2937 !important; color: #ffffff !important; " +
                       "border: 1px solid #374151 !important; border-radius: 8px !important; " +
                       "padding: 6px 12px !important; font-size: 13px !important; font-weight: 800 !important; " +
                       "cursor: pointer !important; user-select: none !important; font-family: inherit !important; " +
                       "display: inline-flex !important; align-items: center !important; justify-content: center !important; " +
                       "min-width: 32px !important; min-height: 32px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.12) !important;";

    var row1 = document.createElement("div");
    row1.style.cssText = "display: flex !important; flex-wrap: wrap !important; gap: 8px !important; " +
                         "align-items: center !important; justify-content: center !important; width: 100% !important; " +
                         "color: #111827 !important; font-size: 12px !important; font-weight: 700 !important;";

    row1.innerHTML = '<div style="display:flex !important; align-items:center !important; gap:4px !important;">' +
                     '<span>Posición:</span> ' +
                     '<button type="button" class="nvx-pv-control-btn" data-act="up" style="' + pillBtnStyle + '">↑</button>' +
                     '<button type="button" class="nvx-pv-control-btn" data-act="down" style="' + pillBtnStyle + '">↓</button>' +
                     '<button type="button" class="nvx-pv-control-btn" data-act="left" style="' + pillBtnStyle + '">←</button>' +
                     '<button type="button" class="nvx-pv-control-btn" data-act="right" style="' + pillBtnStyle + '">→</button>' +
                     '</div>' +
                     '<div style="display:flex !important; align-items:center !important; gap:4px !important; margin-left: 6px !important;">' +
                     '<span>Tamaño:</span> ' +
                     '<button type="button" class="nvx-pv-control-btn" data-act="plus" style="' + pillBtnStyle + '">+</button>' +
                     '<button type="button" class="nvx-pv-control-btn" data-act="minus" style="' + pillBtnStyle + '">−</button>' +
                     '</div>';

    var row2 = document.createElement("div");
    row2.style.cssText = "display: flex !important; flex-wrap: wrap !important; gap: 8px !important; " +
                         "align-items: center !important; justify-content: center !important; width: 100% !important; " +
                         "color: #111827 !important; font-size: 12px !important; font-weight: 700 !important;";

    var btnPhotoHtml = (currentVideo && !isFrozenPhoto) ? '<button type="button" class="nvx-pv-control-btn" data-act="snap" style="' + pillBtnStyle + ' background: #10B981 !important; border-color: #059669 !important;">📸 Sacar foto</button>' : '';
    var btnReCamHtml = isFrozenPhoto ? '<button type="button" class="nvx-pv-control-btn" data-act="recam" style="' + pillBtnStyle + ' background: #3B82F6 !important; border-color: #2563EB !important;">📹 Volver a cámara</button>' : '';
    var btnFlipHtml = (currentVideo && !isFrozenPhoto) ? '<button type="button" class="nvx-pv-control-btn" data-act="flip" style="' + pillBtnStyle + '">⇆</button>' : '';
    var btnRotLHtml = habilitarRotar ? '<button type="button" class="nvx-pv-control-btn" data-act="rotL" style="' + pillBtnStyle + '">↺</button>' : '';
    var btnRotRHtml = habilitarRotar ? '<button type="button" class="nvx-pv-control-btn" data-act="rotR" style="' + pillBtnStyle + '">↻</button>' : '';

    var row2Content = '';
    if (btnPhotoHtml) row2Content += btnPhotoHtml;
    if (btnReCamHtml) row2Content += btnReCamHtml;
    if (btnFlipHtml) row2Content += btnFlipHtml;
    if (habilitarRotar) row2Content += btnRotLHtml + btnRotRHtml;
    row2Content += '<button type="button" class="nvx-pv-control-btn" data-act="reset" style="' + pillBtnStyle + ' padding: 6px 12px !important;">🔄 Reset</button>';

    row2.innerHTML = row2Content;

    controlsBar.appendChild(row1);
    controlsBar.appendChild(row2);
    content.appendChild(controlsBar);

    applyCategoryDefaults();

    var ctrlBtns = controlsBar.querySelectorAll(".nvx-pv-control-btn");
    for (var b = 0; b < ctrlBtns.length; b++) {
      (function(btnEl) {
        btnEl.onclick = function() {
          var act = btnEl.getAttribute("data-act");
          var stepPos = 12;
          var stepScale = 0.1;
          var stepRot = 15;

          if (act === "up") userY -= stepPos;
          else if (act === "down") userY += stepPos;
          else if (act === "left") userX -= stepPos;
          else if (act === "right") userX += stepPos;
          else if (act === "plus") userScale = Math.min(3.0, userScale + stepScale);
          else if (act === "minus") userScale = Math.max(0.2, userScale - stepScale);
          else if (act === "rotL") userRot -= stepRot;
          else if (act === "rotR") userRot += stepRot;
          else if (act === "reset") {
            userX = 0; userY = 0; userScale = 1.0; userRot = 0;
            applyCategoryDefaults();
          } else if (act === "flip") {
            facingMode = (facingMode === "user") ? "environment" : "user";
            startCameraStream();
            return;
          } else if (act === "snap") {
            if (currentVideo) captureCurrentFrame(currentVideo);
            return;
          } else if (act === "recam") {
            isFrozenPhoto = false;
            startCameraStream();
            return;
          }
          updateProductTransform();
        };
      })(ctrlBtns[b]);
    }

    // Si hay video, lanzar tracking cuando MediaPipe esté listo
    if (currentVideo && !isFrozenPhoto) {
      ensureMediaPipe(function() {
        var badge = document.getElementById("nevux-pv-ai-badge");
        if (mpReady && badge) badge.style.display = "inline-block";
        if (mpReady) {
          runTrackingLoop(currentVideo, stage);
        }
      });
    }
  };

  var startCameraStream = function() {
    stopCamera();
    isFrozenPhoto = false;

    var video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;

    content.innerHTML = '<div style="font-size: 14px !important; color: #ffffff !important; opacity: 0.8 !important;">Iniciando cámara...</div>';

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }
      }).then(function(stream) {
        mediaStream = stream;
        video.srcObject = stream;
        video.onloadedmetadata = function() {
          video.play();
          renderTryOnView(video);
        };
      }).catch(function(err) {
        content.innerHTML = '<div style="text-align: center !important; padding: 20px !important;">' +
                            '<div style="font-size: 14px !important; color: #ef4444 !important; font-weight: 700 !important; margin-bottom: 8px !important;">⚠️ No se pudo acceder a la cámara</div>' +
                            '<div style="font-size: 12px !important; color: #ffffff !important; opacity: 0.7 !important; margin-bottom: 16px !important;">Permití el acceso a la cámara o subí una imagen de tu galería.</div>' +
                            '<button type="button" id="nevux-pv-retry-choice" style="background: #10B981 !important; color: #ffffff !important; border: none !important; border-radius: 20px !important; padding: 10px 18px !important; font-weight: 800 !important; cursor: pointer !important;">Volver al inicio</button>' +
                            '</div>';
        var retryBtn = document.getElementById("nevux-pv-retry-choice");
        if (retryBtn) retryBtn.onclick = renderChoiceView;
      });
    } else {
      content.innerHTML = '<div style="font-size: 13px !important; color: #ef4444 !important;">Cámara no soportada en este navegador.</div>';
    }
  };

  var handleFileUpload = function(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = document.createElement("img");
      img.src = e.target.result;
      img.onload = function() {
        stopCamera();
        isFrozenPhoto = true;
        renderTryOnView(img);
      };
    };
    reader.readAsDataURL(file);
  };

  var renderChoiceView = function() {
    stopCamera();
    content.innerHTML = "";

    var box = document.createElement("div");
    box.style.cssText = "display: flex !important; flex-direction: column !important; " +
                        "align-items: center !important; justify-content: center !important; " +
                        "gap: 16px !important; text-align: center !important; width: 100% !important; height: 100% !important; padding: 20px !important; box-sizing: border-box !important;";

    var promptTxt = document.createElement("div");
    promptTxt.style.cssText = "font-size: 16px !important; font-weight: 700 !important; color: #ffffff !important;";
    promptTxt.innerText = "¿Cómo querés probarte el producto?";
    box.appendChild(promptTxt);

    var btnsRow = document.createElement("div");
    btnsRow.style.cssText = "display: flex !important; flex-wrap: wrap !important; gap: 12px !important; justify-content: center !important;";

    var ctaStyle = "background: #27272a !important; color: #ffffff !important; " +
                   "border: 1px solid rgba(255,255,255,0.2) !important; border-radius: 30px !important; " +
                   "padding: 12px 22px !important; font-size: 14px !important; font-weight: 800 !important; " +
                   "cursor: pointer !important; display: inline-flex !important; align-items: center !important; " +
                   "gap: 8px !important; box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;";

    if (habilitarCamara) {
      var btnCam = document.createElement("button");
      btnCam.type = "button";
      btnCam.style.cssText = ctaStyle;
      btnCam.innerHTML = "📷 Usar cámara";
      btnCam.onclick = startCameraStream;
      btnsRow.appendChild(btnCam);
    }

    if (habilitarSubir) {
      var btnUpload = document.createElement("label");
      btnUpload.style.cssText = ctaStyle;
      btnUpload.innerHTML = '🖼️ Subir imagen <input type="file" id="nevux-pv-file-input" accept="image/*" style="display:none !important;" />';
      btnsRow.appendChild(btnUpload);

      setTimeout(function() {
        var fileInp = document.getElementById("nevux-pv-file-input");
        if (fileInp) {
          fileInp.onchange = function(e) {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          };
        }
      }, 50);
    }

    box.appendChild(btnsRow);
    content.appendChild(box);
  };

  renderChoiceView();
};

function renderProbadorVirtual(widget) {
  if (!widget || !widget.config) return;
  var cfg = widget.config;

  var textoBoton = cfg.texto_boton || 'Probador virtual';
  var mostrarPercha = cfg.mostrar_icono_percha !== false;
  var imagenCustom = cfg.imagen_producto || cfg.imagen_custom_url || '';
  var usarImgProdRespaldo = cfg.usar_imagen_producto !== false;
  var ubicacion = cfg.ubicacion || 'debajo_precio';
  var tipoFondo = cfg.tipo_fondo || 'solido';
  var colorFondo = cfg.color_fondo || '#111827';
  var colorFondo2 = cfg.color_fondo_2 || '#374151';
  var colorTextoBoton = cfg.color_texto_boton || '#ffffff';
  var tamTextoBtn = cfg.tamano_texto_boton || 14;
  var bordeBtn = cfg.borde_boton !== undefined ? cfg.borde_boton : 25;
  var paddingBtn = cfg.padding_boton !== undefined ? cfg.padding_boton : 12;
  var marginTop = cfg.margin_top !== undefined ? cfg.margin_top : 10;
  var marginBottom = cfg.margin_bottom !== undefined ? cfg.margin_bottom : 15;

  if (document.getElementById('nevux-probador-virtual-' + widget.id)) return;

  var productImgUrl = '';
  if (imagenCustom && imagenCustom.trim() !== '') {
    productImgUrl = imagenCustom.trim();
  } else if (usarImgProdRespaldo && window.LS && window.LS.product && window.LS.product.featured_image) {
    productImgUrl = window.LS.product.featured_image;
  } else {
    var imgEl = document.querySelector('.js-product-slide img, [data-store="product-image"] img, .product-image img');
    if (imgEl && imgEl.src) productImgUrl = imgEl.src;
  }

  var container = document.createElement('div');
  container.id = 'nevux-probador-virtual-' + widget.id;
  container.className = 'nevux-widget-container';
  container.style.marginTop = marginTop + 'px';
  container.style.marginBottom = marginBottom + 'px';
  container.style.clear = 'both';

  var bgStyle = colorFondo;
  if (tipoFondo === 'degrade') {
    bgStyle = 'linear-gradient(135deg, ' + colorFondo + ', ' + colorFondo2 + ')';
  }

  var btnStyle = 'background: ' + bgStyle + ';' +
    'color: ' + colorTextoBoton + ';' +
    'border: none;' +
    'border-radius: ' + bordeBtn + 'px;' +
    'padding: ' + paddingBtn + 'px ' + (paddingBtn + 10) + 'px;' +
    'font-size: ' + tamTextoBtn + 'px;' +
    'font-weight: 800;' +
    'cursor: pointer;' +
    'display: inline-flex;' +
    'align-items: center;' +
    'justify-content: center;' +
    'gap: 8px;' +
    'box-shadow: 0 4px 12px rgba(0,0,0,0.15);' +
    'transition: transform 0.2s, box-shadow 0.2s;' +
    'font-family: inherit;';

  if (ubicacion === 'flotante_abajo') {
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '999990';
    container.style.marginTop = '0px';
    container.style.marginBottom = '0px';
  }

  var labelConIcono = (mostrarPercha ? '🧥 ' : '') + textoBoton;

  var btnHtml = '<button type="button" id="nevux-pv-btn-' + widget.id + '" style="' + btnStyle + '">' +
    labelConIcono +
    '</button>';

  container.innerHTML = btnHtml;

  if (ubicacion === 'flotante_abajo') {
    document.body.appendChild(container);
  } else {
    var target = null;
    if (ubicacion === 'encima_formulario') {
      target = document.querySelector('.js-product-form, form[action*="/cart/add"], .product-form');
    } else {
      target = document.querySelector('.js-price-display, .product-price, [data-store="product-price"]');
    }

    if (!target) {
      target = document.querySelector('.js-product-form, form[action*="/cart/add"], .product-form');
    }

    if (target && target.parentNode) {
      if (ubicacion === 'encima_formulario') {
        target.parentNode.insertBefore(container, target);
      } else {
        if (target.nextSibling) {
          target.parentNode.insertBefore(container, target.nextSibling);
        } else {
          target.parentNode.appendChild(container);
        }
      }
    } else {
      document.body.appendChild(container);
    }
  }

  var openBtn = document.getElementById('nevux-pv-btn-' + widget.id);
  if (openBtn) {
    openBtn.addEventListener('click', function() {
      openProbadorModal(widget, productImgUrl);
    });
  }
        }
      /* ==========================================================================
   WIDGET #28: CAJA DE OPINIONES (caja-opiniones)
   Inyección exterior a 100% ancho horizontal
   ========================================================================== */

function renderCajaOpiniones(w) {
  var config = w.config || {};
  var opinions = config.opinions || [];
  if (!opinions || opinions.length === 0) return;

  var valid = [];
  for (var vi = 0; vi < opinions.length; vi++) {
    var opp = opinions[vi];
    if (opp && (opp.name || opp.text)) valid.push(opp);
  }
  if (valid.length === 0) return;
  opinions = valid;

  var location = config.location || 'product_after';

  var bgColor = config.bgColor || '#f5f5f5';
  var textColor = config.textColor || '#333333';
  var starColor = config.starColor || '#f5b301';
  var borderColor = config.borderColor || '#e5e7eb';
  var showBorder = config.showBorder !== false;

  var paddingVal = 14;
  var borderRadius = 12;
  var marginTop = 14;
  var marginBottom = 14;
  var nameFontSize = 15;
  var textFontSize = 14;
  var avatarSize = 42;

  var autoplayEnabled = config.autoplayEnabled !== false;
  var autoplayInterval = (config.autoplayInterval || 5) * 1000;

  var containerId = 'nevux-opiniones-' + w.id;
  if (document.getElementById(containerId)) return;

  // Buscar el elemento formulario completo de compra
  var target = null;
  if (location === 'cart') {
    target = document.querySelector('.cart-summary') ||
             document.querySelector('.js-cart-total') ||
             document.querySelector('#cart-total') ||
             document.querySelector('.js-cart-container') ||
             document.querySelector('#main-cart');
  } else if (location === 'price_after') {
    target = document.querySelector('.js-price-container') ||
             document.querySelector('.js-product-price-container') ||
             document.querySelector('.price-container') ||
             document.querySelector('.js-item-price') ||
             document.querySelector('[data-store="product-price"]') ||
             document.querySelector('.js-price-display');
  } else {
    // product_after (default) / product_before
    var btn = document.querySelector('.js-addtocart') ||
              document.querySelector('.js-add-to-cart-btn') ||
              document.querySelector('form[action*="/cart/add"]') ||
              document.querySelector('form[action*="/comprar"]') ||
              document.querySelector('[data-store="product-buy-button"]') ||
              document.querySelector('.js-product-form');

    if (btn) {
      var formEl = null;
      if (btn.tagName === 'FORM') {
        formEl = btn;
      } else if (btn.closest) {
        formEl = btn.closest('form') || btn.closest('.js-product-form') || btn.closest('.product-buy-container');
      }
      if (!formEl) {
        var p = btn.parentNode;
        if (p && (p.tagName === 'FORM' || (p.className && String(p.className).indexOf('form') !== -1))) {
          formEl = p;
        } else if (p && p.parentNode && p.parentNode.tagName === 'FORM') {
          formEl = p.parentNode;
        } else {
          formEl = p || btn;
        }
      }
      target = formEl;
    } else {
      target = document.querySelector('.js-product-container') ||
               document.querySelector('.product-container') ||
               document.querySelector('.js-price-container');
    }
  }

  if (!target || !target.parentNode) return;

  var div = document.createElement('div');
  div.id = containerId;

  // Estilo 100% Ancho Horizontal
  div.style.cssText = [
    'display:block !important',
    'width:100% !important',
    'max-width:100% !important',
    'box-sizing:border-box !important',
    'clear:both !important',
    'margin-top:' + marginTop + 'px !important',
    'margin-bottom:' + marginBottom + 'px !important',
    'padding:' + paddingVal + 'px !important',
    'background-color:' + bgColor + ' !important',
    'color:' + textColor + ' !important',
    'border:' + (showBorder ? '1px solid ' + borderColor : 'none') + ' !important',
    'border-radius:' + borderRadius + 'px !important',
    'font-family:inherit !important',
    'line-height:1.4 !important',
    'position:relative !important'
  ].join(';');

  var currentIndex = 0;
  var intervalId = null;

  function createStars(rating) {
    var html = '<span style="display:inline-flex !important;align-items:center !important;gap:2px !important;flex-shrink:0 !important;line-height:1 !important;">';
    for (var i = 1; i <= 5; i++) {
      var filled = i <= rating;
      var c = filled ? starColor : '#d1d5db';
      html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="' + (filled ? c : 'none') + '" stroke="' + c + '" stroke-width="2" style="display:block;flex-shrink:0;"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
    }
    html += '</span>';
    return html;
  }

  function escapeHtml(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatText(txt) {
    if (!txt) return '';
    return escapeHtml(txt).replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;color:' + textColor + ';">$1</strong>');
  }

  function renderSlide(index) {
    var op = opinions[index];
    if (!op) return '';

    var nameVal = op.name || 'Cliente';
    var commentVal = op.text || '';
    var photoVal = op.photo || '';
    var isVerified = op.verified !== false;
    var ratingVal = parseInt(op.rating, 10) || 5;
    var showArrows = opinions.length > 1;

    var html = '<div style="display:flex !important;align-items:center !important;justify-content:space-between !important;width:100% !important;gap:8px !important;box-sizing:border-box !important;">';

    html += '<div style="display:flex !important;align-items:center !important;gap:10px !important;min-width:0 !important;flex:1 !important;">';

    if (photoVal) {
      html += '<img src="' + photoVal + '" alt="" style="width:' + avatarSize + 'px !important;height:' + avatarSize + 'px !important;border-radius:50% !important;object-fit:cover !important;display:block !important;flex-shrink:0 !important;">';
    } else {
      html += '<div style="width:' + avatarSize + 'px !important;height:' + avatarSize + 'px !important;border-radius:50% !important;background:#e5e7eb !important;color:#374151 !important;display:flex !important;align-items:center !important;justify-content:center !important;font-weight:700 !important;font-size:15px !important;flex-shrink:0 !important;">' + escapeHtml(nameVal.charAt(0).toUpperCase()) + '</div>';
    }

    html += '<span style="font-weight:700 !important;font-size:' + nameFontSize + 'px !important;color:' + textColor + ' !important;line-height:1.2 !important;white-space:nowrap !important;overflow:hidden !important;text-overflow:ellipsis !important;">' + escapeHtml(nameVal) + '</span>';
    html += createStars(ratingVal);
    html += '</div>';

    if (showArrows) {
      html += '<div style="display:flex !important;align-items:center !important;gap:2px !important;flex-shrink:0 !important;">' +
        '<span class="nevux-prev" style="cursor:pointer !important;user-select:none !important;font-weight:700 !important;padding:2px 6px !important;font-size:18px !important;line-height:1 !important;color:' + textColor + ' !important;opacity:0.6 !important;">‹</span>' +
        '<span class="nevux-next" style="cursor:pointer !important;user-select:none !important;font-weight:700 !important;padding:2px 6px !important;font-size:18px !important;line-height:1 !important;color:' + textColor + ' !important;opacity:0.6 !important;">›</span>' +
        '</div>';
    }

    html += '</div>';

    if (commentVal) {
      html += '<div style="margin-top:10px !important;font-size:' + textFontSize + 'px !important;line-height:1.5 !important;color:' + textColor + ' !important;word-break:break-word !important;text-align:left !important;width:100% !important;box-sizing:border-box !important;">' + formatText(commentVal) + '</div>';
    }

    if (isVerified) {
      html += '<div style="margin-top:8px !important;display:inline-flex !important;align-items:center !important;gap:5px !important;color:#10b981 !important;font-size:12px !important;font-weight:600 !important;background:transparent !important;border:none !important;padding:0 !important;">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>' +
        '<span style="color:#10b981 !important;">Compra verificada</span>' +
        '</div>';
    }

    return html;
  }

  function updateContent() {
    div.style.opacity = '0.35';
    setTimeout(function() {
      div.innerHTML = renderSlide(currentIndex);
      div.style.opacity = '1';
      bindEvents();
    }, 140);
  }

  function bindEvents() {
    if (opinions.length <= 1) return;
    var btnPrev = div.querySelector('.nevux-prev');
    var btnNext = div.querySelector('.nevux-next');
    if (btnPrev) {
      btnPrev.onclick = function(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        if (e && e.preventDefault) e.preventDefault();
        currentIndex = (currentIndex - 1 + opinions.length) % opinions.length;
        updateContent();
        resetInterval();
      };
    }
    if (btnNext) {
      btnNext.onclick = function(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        if (e && e.preventDefault) e.preventDefault();
        currentIndex = (currentIndex + 1) % opinions.length;
        updateContent();
        resetInterval();
      };
    }
  }

  function startInterval() {
    if (autoplayEnabled && opinions.length > 1) {
      intervalId = setInterval(function() {
        currentIndex = (currentIndex + 1) % opinions.length;
        updateContent();
      }, autoplayInterval);
    }
  }

  function resetInterval() {
    if (intervalId) clearInterval(intervalId);
    startInterval();
  }

  div.innerHTML = renderSlide(0);

  // Inyección fuera del formulario de compra
  if (location === 'product_before') {
    target.parentNode.insertBefore(div, target);
  } else {
    if (target.nextSibling) {
      target.parentNode.insertBefore(div, target.nextSibling);
    } else {
      target.parentNode.appendChild(div);
    }
  }

  bindEvents();

  if (opinions.length > 1) {
    div.onmouseenter = function() { if (intervalId) clearInterval(intervalId); };
    div.onmouseleave = function() { startInterval(); };
    startInterval();
  }
            }
  /* ==========================================================================
   WIDGET #29: CAJA DE CONTACTO (caja-contacto)
   ========================================================================== */

function renderCajaContacto(w) {
  try {
    var config = w.config || {};
    var title = config.title || '¿Tenés alguna pregunta?';
    var text = config.text || '';
    var buttonText = config.buttonText || 'Contactanos';
    var buttonLink = config.buttonLink || '#';
    var image = config.image || '';
    var location = config.location || 'product_after';

    var bgColor = config.bgColor || '#ffffff';
    var textColor = config.textColor || '#111111';
    var buttonBg = config.buttonBg || '#191919';
    var buttonTextColor = config.buttonTextColor || '#ffffff';
    var borderColor = config.borderColor || '#e5e5e5';
    var sectionBg = config.sectionBg || 'transparent';
    var showBorder = config.showBorder !== false;

    var titleFontSize = config.titleFontSize || 18;
    var textFontSize = config.textFontSize || 14;
    var borderRadius = typeof config.borderRadius === 'number' ? config.borderRadius : 12;
    var paddingVal = typeof config.padding === 'number' ? config.padding : 20;
    var buttonBorderRadius = typeof config.buttonBorderRadius === 'number' ? config.buttonBorderRadius : 25;

    // Solo se renderiza en ficha de producto
    var pageType = detectPageType();
    if (pageType !== 'product') return;

    var containerId = 'nevux-contacto-' + w.id;
    if (document.getElementById(containerId)) return;

    var target = null;

    if (location === 'description_after') {
      // 1. Selectores directos de descripción
      target = document.querySelector(
        '.js-product-description, [data-store="product-description"], ' +
        '.product-description, #description, .description, ' +
        '.js-product-description-container, .user-content, ' +
        '.product-user-content, .js-product-user-content, ' +
        '#product-description, .description-content, .js-product-detail-description, ' +
        '.product-detail-description, .product__description, .js-product-tabs'
      );

      // 2. Búsqueda inteligente por encabezado "Descripción"
      if (!target) {
        var headings = document.querySelectorAll('h2, h3, h4, .tab-header, .accordion-header, .js-accordion-toggle, [data-tab]');
        for (var hi = 0; hi < headings.length; hi++) {
          var hTxt = (headings[hi].textContent || '').toLowerCase();
          if (hTxt.indexOf('descripci') !== -1) {
            target = headings[hi].closest('.accordion, .tab-content, .product-block, div') || headings[hi];
            break;
          }
        }
      }

      // 3. Fallback: al final de la columna/ficha del producto
      if (!target) {
        target = document.querySelector('.js-product-detail, .product-detail, .js-product-container, .product-container');
      }
    } else {
      // product_after (default): debajo del formulario/botón de compra
      var btn = document.querySelector('.js-addtocart') ||
                document.querySelector('.js-add-to-cart-btn') ||
                document.querySelector('form[action*="/cart/add"]') ||
                document.querySelector('form[action*="/comprar"]') ||
                document.querySelector('[data-store="product-buy-button"]') ||
                document.querySelector('.js-product-form');

      if (btn) {
        var formEl = null;
        if (btn.tagName === 'FORM') {
          formEl = btn;
        } else if (btn.closest) {
          formEl = btn.closest('form') || btn.closest('.js-product-form') || btn.closest('.product-buy-container');
        }
        if (!formEl) {
          var p = btn.parentNode;
          if (p && (p.tagName === 'FORM' || (p.className && String(p.className).indexOf('form') !== -1))) {
            formEl = p;
          } else if (p && p.parentNode && p.parentNode.tagName === 'FORM') {
            formEl = p.parentNode;
          } else {
            formEl = p || btn;
          }
        }
        target = formEl;
      } else {
        target = document.querySelector('.js-product-container') ||
                 document.querySelector('.product-container') ||
                 document.querySelector('.js-price-container');
      }
    }

    if (!target || !target.parentNode) return;

    var wrapper = document.createElement('div');
    wrapper.id = containerId;

    var wrapperStyle = [
      'display:block !important',
      'width:100% !important',
      'max-width:100% !important',
      'box-sizing:border-box !important',
      'clear:both !important',
      'margin-top:20px !important',
      'margin-bottom:20px !important',
      'position:relative !important'
    ];

    if (sectionBg && sectionBg !== 'transparent') {
      wrapperStyle.push('background-color:' + sectionBg + ' !important');
      wrapperStyle.push('padding:16px !important');
      wrapperStyle.push('border-radius:' + (borderRadius + 4) + 'px !important');
    }

    wrapper.style.cssText = wrapperStyle.join(';');

    var escapeHtml = function(s) {
      if (!s) return '';
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };

    var boxHtml = '<div style="display:block !important;width:100% !important;box-sizing:border-box !important;' +
      'background-color:' + bgColor + ' !important;' +
      'color:' + textColor + ' !important;' +
      'border:' + (showBorder ? '1px solid ' + borderColor : 'none') + ' !important;' +
      'border-radius:' + borderRadius + 'px !important;' +
      'padding:' + paddingVal + 'px !important;' +
      'font-family:inherit !important;' +
      'box-shadow:0 2px 8px rgba(0,0,0,0.03) !important;">' +
        '<div style="display:flex !important;align-items:flex-start !important;gap:16px !important;width:100% !important;box-sizing:border-box !important;">';

    if (image) {
      boxHtml += '<img src="' + image + '" alt="Contacto" style="width:52px !important;height:52px !important;border-radius:50% !important;object-fit:cover !important;display:block !important;flex-shrink:0 !important;" />';
    } else {
      boxHtml += '<div style="width:52px !important;height:52px !important;border-radius:50% !important;background:#e5e7eb !important;display:flex !important;align-items:center !important;justify-content:center !important;font-size:22px !important;flex-shrink:0 !important;">👨‍💼</div>';
    }

    boxHtml += '<div style="flex:1 !important;min-width:0 !important;">' +
      '<div style="font-size:' + titleFontSize + 'px !important;font-weight:800 !important;color:' + textColor + ' !important;line-height:1.25 !important;margin-bottom:6px !important;">' + escapeHtml(title) + '</div>';

    if (text) {
      boxHtml += '<div style="font-size:' + textFontSize + 'px !important;color:' + textColor + ' !important;opacity:0.85 !important;line-height:1.45 !important;margin-bottom:14px !important;">' + escapeHtml(text) + '</div>';
    }

    var href = escapeHtml(buttonLink);
    var targetAttr = (buttonLink.indexOf('wa.me') !== -1 || buttonLink.indexOf('whatsapp') !== -1 || buttonLink.indexOf('http') === 0) ? ' target="_blank" rel="noopener noreferrer"' : '';

    boxHtml += '<a href="' + href + '"' + targetAttr + ' style="display:inline-block !important;background-color:' + buttonBg + ' !important;color:' + buttonTextColor + ' !important;border-radius:' + buttonBorderRadius + 'px !important;border:none !important;padding:10px 22px !important;font-size:14px !important;font-weight:700 !important;text-decoration:none !important;cursor:pointer !important;font-family:inherit !important;line-height:1.2 !important;text-align:center !important;">' + escapeHtml(buttonText) + '</a>' +
      '</div>' +
      '</div>' +
      '</div>';

    wrapper.innerHTML = boxHtml;

    if (target.nextSibling) {
      target.parentNode.insertBefore(wrapper, target.nextSibling);
    } else {
      target.parentNode.appendChild(wrapper);
    }
  } catch (err) {
    // Silencioso
  }
}
                                              // WIDGET #30: SLIDER DE IMÁGENES
  var renderSliderImagenes = function(w) {
    var pType = detectPageType();
    if (pType !== "product") return;

    if (document.getElementById("nvx-slider-imagenes-" + w.id)) return;

    var cfg = w.config || {};
    var targetCatId = w.target_category_id || (cfg && cfg.category_id);
    if (w.target_type === "category" && targetCatId) {
      if (!checkCategoryMatch(targetCatId)) return;
    }

    var images = cfg.images || [];
    if (!images || images.length === 0) return;

    var title = cfg.title || "";
    var position = cfg.position || "before-description";
    var speed = typeof cfg.speed === "number" ? cfg.speed : 0.8;
    var imageSize = cfg.imageSize || 250;
    var borderRadius = typeof cfg.borderRadius === "number" ? cfg.borderRadius : 10;
    var titleAlign = cfg.titleAlign || "left";
    var titleColor = cfg.titleColor || "#000000";
    var titleSize = cfg.titleSize || 22;
    var bgColor = cfg.bgColor || "#ffffff";
    var gap = typeof cfg.gap === "number" ? cfg.gap : 12;
    var disableModal = !!cfg.disableModal;
    var modalControlsColor = cfg.modalControlsColor || "#333333";
    var campaignTheme = cfg.campaignTheme || "none";

    // 7 PRESETS OFICIALES NEVUX v32 (Colores Vibrantes)
    var PRESETS_DATA = {
      "black-friday": { bg: "#F59E0B", text: "#111827", border: "#D97706", accent: "#111827" },
      "hot-sale": { bg: "#EF4444", text: "#ffffff", border: "#B91C1C", accent: "#ffffff" },
      "cyber-monday": { bg: "#3B82F6", text: "#ffffff", border: "#1D4ED8", accent: "#ffffff" },
      "navidad": { bg: "#064E3B", text: "#ffffff", border: "#047857", accent: "#EF4444" },
      "san-valentin": { bg: "#831843", text: "#ffffff", border: "#9d174d", accent: "#F43F5E" },
      "dia-padre-madre": { bg: "#312E81", text: "#ffffff", border: "#4338ca", accent: "#10B981" },
      "liquidacion": { bg: "#7F1D1D", text: "#ffffff", border: "#991b1b", accent: "#FBBF24" }
    };

    var borderCss = "border:1px solid rgba(0,0,0,0.06) !important;";
    if (campaignTheme !== "none" && PRESETS_DATA[campaignTheme]) {
      var th = PRESETS_DATA[campaignTheme];
      bgColor = th.bg;
      titleColor = th.text;
      modalControlsColor = th.accent;
      borderCss = "border:2px solid " + th.border + " !important;";
    }

    // Inyectar Keyframes de animación continua horizontal (si no existen)
    if (!document.getElementById("nvx-slider-keyframes")) {
      var styleEl = document.createElement("style");
      styleEl.id = "nvx-slider-keyframes";
      styleEl.innerHTML = "@keyframes nvxContinuousSlide { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } " +
        ".nvx-slider-track:hover { animation-play-state: paused !important; }";
      document.head.appendChild(styleEl);
    }

    var container = document.createElement("div");
    container.id = "nvx-slider-imagenes-" + w.id;
    container.className = "nvx-widget-container";
    container.style.cssText = "width:100% !important; margin:20px 0 !important; box-sizing:border-box !important; background-color:" + bgColor + " !important; " + borderCss + " border-radius:12px !important; padding:16px !important; overflow:hidden !important; position:relative !important; display:block !important; visibility:visible !important; opacity:1 !important; clear:both !important;";

    var html = "";

    if (title) {
      var alignCss = titleAlign === "center" ? "center" : "left";
      html += '<div style="font-size:' + titleSize + 'px !important; font-weight:800 !important; color:' + titleColor + ' !important; text-align:' + alignCss + ' !important; margin-bottom:14px !important; font-family:system-ui, -apple-system, sans-serif !important;">' + title + '</div>';
    }

    var previewDuration = speed <= 0 ? 0 : Math.max(8, Math.round(40 - speed * 28));
    var animCss = speed > 0 ? "animation: nvxContinuousSlide " + previewDuration + "s linear infinite !important;" : "";

    html += '<div style="overflow:hidden !important; width:100% !important; position:relative !important;">';
    html += '<div class="nvx-slider-track" style="display:flex !important; gap:' + gap + 'px !important; width:max-content !important; ' + animCss + '">';

    // Duplicar array para carrusel infinito continuo
    var doubleImages = images.concat(images);
    for (var i = 0; i < doubleImages.length; i++) {
      var img = doubleImages[i];
      var cursorCss = disableModal ? "default" : "pointer";
      html += '<div class="nvx-slider-item" data-idx="' + (i % images.length) + '" style="width:' + imageSize + 'px !important; height:' + Math.round(imageSize * 1.15) + 'px !important; border-radius:' + borderRadius + 'px !important; overflow:hidden !important; flex-shrink:0 !important; background-color:#f3f4f6 !important; border:1px solid rgba(0,0,0,0.06) !important; cursor:' + cursorCss + ' !important;">';
      html += '<img src="' + img.url + '" alt="" style="width:100% !important; height:100% !important; object-fit:cover !important; display:block !important;" />';
      html += '</div>';
    }

    html += '</div>';
    html += '</div>';

    container.innerHTML = html;

    // Helper: encontrar bloque de descripción (el que YA funciona en after-description)
    var findDescriptionEl = function() {
      var descEl = document.querySelector(".js-product-description, [data-store='product-description'], .product-description, #description, .description, .user-content, .js-product-tabs, .product-detail-description, .product-description-container, #product-description, .js-product-description-container");
      if (!descEl) {
        var headers = document.querySelectorAll("h2, h3, h4, .tab-header, .accordion-header, .js-accordion-toggle, [data-tab], .tab-title, .nav-link");
        for (var h = 0; h < headers.length; h++) {
          var ht = (headers[h].textContent || "").toLowerCase();
          if (ht.indexOf("descripci") !== -1 || ht.indexOf("description") !== -1) {
            descEl = headers[h].closest(".tab-content, .accordion, .js-accordion-container, .product-tabs, .tabs-content, section, .tab-pane") || headers[h].parentNode;
            break;
          }
        }
      }
      return descEl || null;
    };

    // Helper: insertar debajo del botón comprar (Regla #36)
    var insertBelowBuy = function() {
      var forms = document.querySelectorAll("form[action*='/cart/add'], form[action*='/comprar'], form[action*='cart/add'], form.js-product-form, form#product_form, form.product-form, form[data-store='product-form']");
      var f;
      for (f = 0; f < forms.length; f++) {
        var formEl = forms[f];
        // Evitar forms escondidos (display none / sticky mobile oculto)
        var formStyle = window.getComputedStyle(formEl);
        if (formStyle && (formStyle.display === "none" || formStyle.visibility === "hidden")) continue;
        if (formEl.parentNode) {
          formEl.parentNode.insertBefore(container, formEl.nextSibling);
          return true;
        }
      }

      var btn = document.querySelector(".js-product-buy-button, [data-store='product-buy-button'], .btn-add-to-cart, .js-addtocart, .js-prod-submit-form, button[name='add'], #button-cart");
      if (btn) {
        var btnStyle = window.getComputedStyle(btn);
        if (!(btnStyle && (btnStyle.display === "none" || btnStyle.visibility === "hidden"))) {
          var anchor = btn.closest("form, .product-buy, .product-actions, .js-product-buy-button-container, .buy-button-wrapper, .product-form-buttons") || btn.parentNode;
          if (anchor && anchor.parentNode) {
            anchor.parentNode.insertBefore(container, anchor.nextSibling);
            return true;
          }
        }
      }
      return false;
    };

    var inserted = false;
    var descEl = findDescriptionEl();

    if (position === "after-description") {
      // DESPUÉS de la descripción (ya funcionaba)
      if (descEl && descEl.parentNode) {
        descEl.parentNode.insertBefore(container, descEl.nextSibling);
        inserted = true;
      } else {
        var mainAfter = document.querySelector(".js-product-detail, .product-detail, .js-product-container, .product-container");
        if (mainAfter) {
          mainAfter.appendChild(container);
          inserted = true;
        }
      }
    } else {
      // ANTES de la descripción = insertar JUSTO ANTES del bloque descripción
      // (queda debajo del precio/botón y arriba de la descripción)
      if (descEl && descEl.parentNode) {
        descEl.parentNode.insertBefore(container, descEl);
        inserted = true;
      }

      // Fallback 1: debajo del form/botón comprar
      if (!inserted) {
        inserted = insertBelowBuy();
      }

      // Fallback 2: debajo del bloque de precio
      if (!inserted) {
        var priceBox = document.querySelector(".js-price-container, .js-product-price-container, .product-price-container, .price-container, .js-item-price, [data-store='product-price'], .product-price");
        if (priceBox && priceBox.parentNode) {
          priceBox.parentNode.insertBefore(container, priceBox.nextSibling);
          inserted = true;
        }
      }

      // Fallback 3: columna de info del producto
      if (!inserted) {
        var infoCol = document.querySelector(".js-product-info, .product-info, .product-form-container, .js-product-form-container, .product-details");
        if (infoCol) {
          infoCol.appendChild(container);
          inserted = true;
        }
      }
    }

    // Reintento diferido (temas Tiendanube que montan el DOM tarde)
    if (!inserted || !container.parentNode) {
      var retries = 0;
      var tryInsert = function() {
        if (document.getElementById("nvx-slider-imagenes-" + w.id) && container.parentNode) return;
        retries++;
        var d = findDescriptionEl();
        if (position === "after-description") {
          if (d && d.parentNode) {
            d.parentNode.insertBefore(container, d.nextSibling);
            return;
          }
        } else {
          if (d && d.parentNode) {
            d.parentNode.insertBefore(container, d);
            return;
          }
          if (insertBelowBuy()) return;
        }
        if (retries < 5) {
          setTimeout(tryInsert, 600);
        } else {
          var mainFinal = document.querySelector(".js-product-detail, .product-detail, .js-product-container, .product-container, main, #content");
          if (mainFinal && !container.parentNode) mainFinal.appendChild(container);
        }
      };
      setTimeout(tryInsert, 500);
    }

    // Modal / Lightbox al hacer click en una imagen (si no está desactivado)
    if (!disableModal) {
      var items = container.querySelectorAll(".nvx-slider-item");
      for (var k = 0; k < items.length; k++) {
        (function(itemEl) {
          itemEl.addEventListener("click", function() {
            var rawIdx = parseInt(itemEl.getAttribute("data-idx") || "0", 10);
            openImageModal(images, rawIdx, modalControlsColor);
          });
        })(items[k]);
      }
    }
  };
    // WIDGET #31: VIDEO Y TEXTO
  var renderVideoTexto = function(w) {
    var pType = detectPageType();
    if (pType !== "product") return;

    if (document.getElementById("nvx-video-texto-" + w.id)) return;

    var cfg = w.config || {};
    var targetCatId = w.target_category_id || (cfg && cfg.category_id);
    if (w.target_type === "category" && targetCatId) {
      if (!checkCategoryMatch(targetCatId)) return;
    }

    var title = cfg.title || "";
    var description = cfg.description || "";
    var videoType = cfg.videoType || "youtube";
    var youtubeUrl = cfg.youtubeUrl || "";
    var customVideoUrl = cfg.customVideoUrl || "";
    var position = cfg.position || "before-description";
    var videoPosition = cfg.videoPosition || "right";

    var bgColor = cfg.bgColor || "#fafafa";
    var titleColor = cfg.titleColor || "#111827";
    var textColor = cfg.textColor || "#4B5563";
    var titleSize = cfg.titleSize || 22;
    var textSize = cfg.textSize || 15;
    var campaignTheme = cfg.campaignTheme || "none";

    var PRESETS_DATA = {
      "black-friday": { bg: "#F59E0B", text: "#111827", border: "#D97706" },
      "hot-sale": { bg: "#EF4444", text: "#ffffff", border: "#B91C1C" },
      "cyber-monday": { bg: "#3B82F6", text: "#ffffff", border: "#1D4ED8" },
      "navidad": { bg: "#064E3B", text: "#ffffff", border: "#047857" },
      "san-valentin": { bg: "#831843", text: "#ffffff", border: "#9d174d" },
      "dia-padre-madre": { bg: "#312E81", text: "#ffffff", border: "#4338ca" },
      "liquidacion": { bg: "#7F1D1D", text: "#ffffff", border: "#991b1b" }
    };

    var borderCss = "border:1px solid rgba(0,0,0,0.06) !important;";
    if (campaignTheme !== "none" && PRESETS_DATA[campaignTheme]) {
      var th = PRESETS_DATA[campaignTheme];
      bgColor = th.bg;
      titleColor = th.text;
      textColor = th.text;
      borderCss = "border:2px solid " + th.border + " !important;";
    }

    var getEmbedUrl = function(url) {
      if (!url) return "";
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      return (match && match[2].length === 11) ? "https://www.youtube.com/embed/" + match[2] : url;
    };

    var container = document.createElement("div");
    container.id = "nvx-video-texto-" + w.id;
    container.className = "nvx-widget-container";
    container.style.cssText = "width:100% !important; margin:20px 0 !important; box-sizing:border-box !important; background-color:" + bgColor + " !important; " + borderCss + " border-radius:16px !important; padding:20px !important; overflow:hidden !important; position:relative !important; display:block !important;";

    var rowDirection = videoPosition === "left" ? "row-reverse" : "row";

    var html = '<div style="display:flex !important; flex-wrap:wrap !important; gap:20px !important; align-items:center !important; flex-direction:' + rowDirection + ' !important;">';

    // Bloque Texto
    html += '<div style="flex:1 1 220px !important; min-width:200px !important;">';
    if (title) {
      html += '<div style="font-size:' + titleSize + 'px !important; font-weight:800 !important; color:' + titleColor + ' !important; margin-bottom:10px !important; line-height:1.3 !important; font-family:system-ui, -apple-system, sans-serif !important;">' + title + '</div>';
    }
    if (description) {
      html += '<div style="font-size:' + textSize + 'px !important; color:' + textColor + ' !important; line-height:1.5 !important; font-family:system-ui, -apple-system, sans-serif !important;">' + description + '</div>';
    }
    html += '</div>';

    // Bloque Video
    html += '<div style="flex:1 1 260px !important; min-width:240px !important; width:100% !important;">';
    html += '<div style="position:relative !important; width:100% !important; padding-bottom:56.25% !important; height:0 !important; border-radius:12px !important; overflow:hidden !important; background-color:#000000 !important; box-shadow:0 4px 12px rgba(0,0,0,0.1) !important;">';

    if (videoType === "youtube") {
      var embed = getEmbedUrl(youtubeUrl);
      if (embed) {
        html += '<iframe src="' + embed + '" title="Video" style="position:absolute !important; top:0 !important; left:0 !important; width:100% !important; height:100% !important; border:none !important;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      }
    } else {
      if (customVideoUrl) {
        html += '<video src="' + customVideoUrl + '" controls style="position:absolute !important; top:0 !important; left:0 !important; width:100% !important; height:100% !important; object-fit:cover !important;"></video>';
      }
    }

    html += '</div>';
    html += '</div>';

    html += '</div>';

    container.innerHTML = html;

    var findDescriptionEl = function() {
      var descEl = document.querySelector(".js-product-description, [data-store='product-description'], .product-description, #description, .description, .user-content, .js-product-tabs, .product-detail-description, .product-description-container, #product-description, .js-product-description-container");
      if (!descEl) {
        var headers = document.querySelectorAll("h2, h3, h4, .tab-header, .accordion-header, .js-accordion-toggle, [data-tab], .tab-title, .nav-link");
        for (var h = 0; h < headers.length; h++) {
          var ht = (headers[h].textContent || "").toLowerCase();
          if (ht.indexOf("descripci") !== -1 || ht.indexOf("description") !== -1) {
            descEl = headers[h].closest(".tab-content, .accordion, .js-accordion-container, .product-tabs, .tabs-content, section, .tab-pane") || headers[h].parentNode;
            break;
          }
        }
      }
      return descEl || null;
    };

    var inserted = false;
    var descEl = findDescriptionEl();

    if (position === "after-description") {
      if (descEl && descEl.parentNode) {
        descEl.parentNode.insertBefore(container, descEl.nextSibling);
        inserted = true;
      } else {
        var mainAfter = document.querySelector(".js-product-detail, .product-detail, .js-product-container, .product-container");
        if (mainAfter) {
          mainAfter.appendChild(container);
          inserted = true;
        }
      }
    } else {
      if (descEl && descEl.parentNode) {
        descEl.parentNode.insertBefore(container, descEl);
        inserted = true;
      }
      if (!inserted) {
        var cartForm = document.querySelector("form[action*='/cart/add'], form[action*='/comprar'], form.js-product-form, form#product_form, form.product-form");
        if (cartForm && cartForm.parentNode) {
          cartForm.parentNode.insertBefore(container, cartForm.nextSibling);
          inserted = true;
        }
      }
    }

    if (!inserted || !container.parentNode) {
      setTimeout(function() {
        if (document.getElementById("nvx-video-texto-" + w.id) && container.parentNode) return;
        var d = findDescriptionEl();
        if (position === "after-description") {
          if (d && d.parentNode) d.parentNode.insertBefore(container, d.nextSibling);
        } else {
          if (d && d.parentNode) d.parentNode.insertBefore(container, d);
        }
      }, 500);
    }
  };
              // WIDGET #32: TEXTO LIBRE
  var renderTextoLibre = function(w) {
    var pType = detectPageType();
    if (pType !== "product") return;

    if (document.getElementById("nvx-texto-libre-" + w.id)) return;

    var cfg = w.config || {};
    var targetCatId = w.target_category_id || (cfg && cfg.category_id);
    if (w.target_type === "category" && targetCatId) {
      if (!checkCategoryMatch(targetCatId)) return;
    }

    var content = cfg.content || "";
    if (!content || !content.trim()) return;

    var title = cfg.title || "";
    var position = cfg.position || "before-description";

    var h2Size = cfg.h2Size || 22;
    var h3Size = cfg.h3Size || 18;
    var textSize = cfg.textSize || 16;

    var bgColor = cfg.bgColor || "#ffffff";
    var titleColor = cfg.titleColor || "#111827";
    var textColor = cfg.textColor || "#374151";

    var marginTop = typeof cfg.marginTop === "number" ? cfg.marginTop : 0;
    var marginBottom = typeof cfg.marginBottom === "number" ? cfg.marginBottom : 0;
    var paddingTop = typeof cfg.paddingTop === "number" ? cfg.paddingTop : 16;
    var paddingBottom = typeof cfg.paddingBottom === "number" ? cfg.paddingBottom : 16;

    var campaignTheme = cfg.campaignTheme || "none";

    var PRESETS_DATA = {
      "black-friday": { bg: "#F59E0B", text: "#111827", border: "#D97706" },
      "hot-sale": { bg: "#EF4444", text: "#ffffff", border: "#B91C1C" },
      "cyber-monday": { bg: "#3B82F6", text: "#ffffff", border: "#1D4ED8" },
      "navidad": { bg: "#064E3B", text: "#ffffff", border: "#047857" },
      "san-valentin": { bg: "#831843", text: "#ffffff", border: "#9d174d" },
      "dia-padre-madre": { bg: "#312E81", text: "#ffffff", border: "#4338ca" },
      "liquidacion": { bg: "#7F1D1D", text: "#ffffff", border: "#991b1b" }
    };

    var borderCss = "border:1px solid rgba(0,0,0,0.06) !important;";
    if (campaignTheme !== "none" && PRESETS_DATA[campaignTheme]) {
      var th = PRESETS_DATA[campaignTheme];
      bgColor = th.bg;
      titleColor = th.text;
      textColor = th.text;
      borderCss = "border:2px solid " + th.border + " !important;";
    }

    var bgStyle = (bgColor === "transparent") ? "background-color:transparent !important;" : ("background-color:" + bgColor + " !important;");

    var container = document.createElement("div");
    container.id = "nvx-texto-libre-" + w.id;
    container.className = "nvx-widget-container";
    container.style.cssText = "width:100% !important; margin-top:" + marginTop + "px !important; margin-bottom:" + marginBottom + "px !important; padding-top:" + paddingTop + "px !important; padding-bottom:" + paddingBottom + "px !important; padding-left:16px !important; padding-right:16px !important; box-sizing:border-box !important; " + bgStyle + " " + borderCss + " border-radius:12px !important; overflow:hidden !important; position:relative !important; display:block !important;";

    var html = "";

    if (title) {
      html += '<div style="font-size:' + h2Size + 'px !important; font-weight:800 !important; color:' + titleColor + ' !important; margin-bottom:10px !important; line-height:1.3 !important; font-family:system-ui, -apple-system, sans-serif !important;">' + title + '</div>';
    }

    html += '<div style="font-size:' + textSize + 'px !important; color:' + textColor + ' !important; line-height:1.6 !important; word-break:break-word !important; font-family:system-ui, -apple-system, sans-serif !important;">' + content + '</div>';

    container.innerHTML = html;

    var findDescriptionEl = function() {
      var descEl = document.querySelector(".js-product-description, [data-store='product-description'], .product-description, #description, .description, .user-content, .js-product-tabs, .product-detail-description, .product-description-container, #product-description, .js-product-description-container");
      if (!descEl) {
        var headers = document.querySelectorAll("h2, h3, h4, .tab-header, .accordion-header, .js-accordion-toggle, [data-tab], .tab-title, .nav-link");
        for (var h = 0; h < headers.length; h++) {
          var ht = (headers[h].textContent || "").toLowerCase();
          if (ht.indexOf("descripci") !== -1 || ht.indexOf("description") !== -1) {
            descEl = headers[h].closest(".tab-content, .accordion, .js-accordion-container, .product-tabs, .tabs-content, section, .tab-pane") || headers[h].parentNode;
            break;
          }
        }
      }
      return descEl || null;
    };

    var inserted = false;

    if (position === "after-description") {
      var descEl = findDescriptionEl();
      if (descEl && descEl.parentNode) {
        descEl.parentNode.insertBefore(container, descEl.nextSibling);
        inserted = true;
      } else {
        var mainAfter = document.querySelector(".js-product-detail, .product-detail, .js-product-container, .product-container");
        if (mainAfter) {
          mainAfter.appendChild(container);
          inserted = true;
        }
      }
    } else if (position === "after-price") {
      var priceBox = document.querySelector(".js-price-container, .js-product-price-container, .product-price-container, .price-container, .js-item-price, [data-store='product-price'], .product-price, .js-product-price");
      if (priceBox && priceBox.parentNode) {
        priceBox.parentNode.insertBefore(container, priceBox.nextSibling);
        inserted = true;
      }
    }

    if (!inserted) {
      var descEl = findDescriptionEl();
      if (descEl && descEl.parentNode) {
        descEl.parentNode.insertBefore(container, descEl);
        inserted = true;
      } else {
        var cartForm = document.querySelector("form[action*='/cart/add'], form[action*='/comprar'], form.js-product-form, form#product_form, form.product-form");
        if (cartForm && cartForm.parentNode) {
          cartForm.parentNode.insertBefore(container, cartForm.nextSibling);
          inserted = true;
        }
      }
    }

    if (!inserted || !container.parentNode) {
      setTimeout(function() {
        if (document.getElementById("nvx-texto-libre-" + w.id) && container.parentNode) return;
        var d = findDescriptionEl();
        if (position === "after-description") {
          if (d && d.parentNode) d.parentNode.insertBefore(container, d.nextSibling);
        } else if (position === "after-price") {
          var pBox = document.querySelector(".js-price-container, .js-product-price-container, .product-price-container, .price-container, .js-item-price, [data-store='product-price'], .product-price, .js-product-price");
          if (pBox && pBox.parentNode) pBox.parentNode.insertBefore(container, pBox.nextSibling);
        } else {
          if (d && d.parentNode) d.parentNode.insertBefore(container, d);
        }
      }, 500);
    }
  };
        /* ═══════════════════════════════════════════
     WIDGET #32: PASOS (📍) — SCRIPT POR SCROLL v332
     ═══════════════════════════════════════════ */
  var renderPasos = function(w) {
    if (detectPageType() !== "product") return;
    var id = "nvx-pasos-" + w.id;
    if (document.getElementById(id)) return;

    var cfg = w.config || {};
    var steps = cfg.steps || [];
    if (steps.length === 0) return;

    var container = document.createElement("div");
    container.id = id;
    container.className = "nvx-pasos-container";
    container.style.cssText = "width: 100% !important; box-sizing: border-box !important; margin: " + (cfg.marginTop || 0) + "px 0 " + (cfg.marginBottom || 0) + "px 0 !important; clear: both !important; display: block !important;";

    var inner = '<div style="background-color: ' + (cfg.bgColor || "#fafafa") + ' !important; border-radius: 12px !important; padding: ' + (cfg.paddingTop || 24) + 'px 20px ' + (cfg.paddingBottom || 24) + 'px 20px !important; border: ' + (cfg.campaignTheme !== "none" ? "2px solid " + (cfg.lineColor || "#10B981") : "1px solid #e5e7eb") + ' !important; box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important; max-width: 600px !important; margin: 0 auto !important; font-family: system-ui, -apple-system, sans-serif !important; overflow: hidden !important;">';

    if (cfg.sectionTitle) {
      inner += '<div style="font-size: ' + (cfg.sectionTitleSize || 22) + 'px !important; font-weight: 800 !important; color: ' + (cfg.sectionTitleColor || "#191919") + ' !important; text-align: center !important; margin-bottom: 4px !important; line-height: 1.2 !important;">' + cfg.sectionTitle + '</div>';
    }
    if (cfg.sectionSubtitle) {
      inner += '<div style="font-size: ' + (cfg.sectionSubtitleSize || 16) + 'px !important; color: ' + (cfg.sectionSubtitleColor || "#191919") + ' !important; text-align: center !important; margin-bottom: 24px !important; opacity: 0.8 !important; line-height: 1.4 !important;">' + cfg.sectionSubtitle + '</div>';
    }

    inner += '<div style="position: relative !important; padding-left: 40px !important;">';
    
    // Línea de fondo
    inner += '<div style="position: absolute !important; left: 14px !important; top: 10px !important; bottom: 10px !important; width: 2px !important; background-color: #e5e7eb !important; border-radius: 2px !important;"></div>';
    
    // Línea de progreso animada por scroll
    inner += '<div class="nvx-pasos-progress-line" style="position: absolute !important; left: 14px !important; top: 10px !important; width: 2px !important; height: 0% !important; background-color: ' + (cfg.lineColor || "#10B981") + ' !important; border-radius: 2px !important; transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;"></div>';

    inner += '<div style="display: flex !important; flex-direction: column !important; gap: 28px !important;">';

    for (var i = 0; i < steps.length; i++) {
      var s = steps[i];
      var indicatorIcon = "●";
      if (cfg.indicatorStyle === "check") indicatorIcon = "✓";
      else if (cfg.indicatorStyle === "dash") indicatorIcon = "—";

      inner += '<div class="nvx-paso-item" style="position: relative !important; opacity: 0.3 !important; transform: translateX(-15px) !important; transition: all 0.6s ease !important;">';
      
      // Indicador circular
      inner += '<div style="position: absolute !important; left: -40px !important; top: 0px !important; width: 30px !important; height: 30px !important; border-radius: 50% !important; background-color: #ffffff !important; border: 2px solid ' + (cfg.lineColor || "#191919") + ' !important; color: ' + (cfg.lineColor || "#191919") + ' !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 14px !important; font-weight: 800 !important; z-index: 2 !important; box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;">' + indicatorIcon + '</div>';

      inner += '<div style="display: flex !important; flex-direction: column !important; gap: 4px !important;">';
      
      if (s.badge) {
        inner += '<span style="align-self: flex-start !important; font-size: 10px !important; font-weight: 800 !important; padding: 2px 8px !important; border-radius: 6px !important; background-color: ' + (cfg.badgeBgColor || "#191919") + ' !important; color: ' + (cfg.badgeTextColor || "#ffffff") + ' !important; text-transform: uppercase !important; letter-spacing: 0.5px !important;">' + s.badge + '</span>';
      }
      if (s.title) {
        inner += '<div style="font-size: ' + (cfg.stepTitleSize || 18) + 'px !important; font-weight: 800 !important; color: ' + (cfg.stepTitleColor || "#191919") + ' !important; line-height: 1.3 !important;">' + s.title + '</div>';
      }
      if (s.content) {
        inner += '<div style="font-size: ' + (cfg.stepTextSize || 15) + 'px !important; color: ' + (cfg.stepTextColor || "#4b5563") + ' !important; line-height: 1.5 !important;">' + s.content + '</div>';
      }
      if (s.imageUrl) {
        inner += '<img src="' + s.imageUrl + '" style="max-width: 100% !important; border-radius: 8px !important; margin-top: 8px !important; border: 1px solid #e5e7eb !important;" />';
      }

      inner += '</div></div>';
    }

    inner += '</div></div></div>';
    container.innerHTML = inner;

    // Buscador DOM de 3 niveles para la Descripción de Producto (Regla #53)
    var findDescriptionEl = function() {
      var selectors = [
        ".js-product-description",
        "[data-store='product-description']",
        ".product-description",
        "#description",
        ".description",
        ".user-content",
        ".js-product-tabs",
        ".product-detail-description",
        ".js-product-description-container",
        "#product-description",
        ".product-description-container",
        ".product-tabs",
        ".js-tab-container"
      ];
      for (var s = 0; s < selectors.length; s++) {
        var el = document.querySelector(selectors[s]);
        if (el) return el;
      }
      var headers = document.querySelectorAll("h2, h3, h4, .tab-header, .accordion-header, .js-accordion-toggle, [data-tab]");
      for (var h = 0; h < headers.length; h++) {
        var head = headers[h];
        if (head && head.textContent && head.textContent.toLowerCase().indexOf("descripci") !== -1) {
          return head.parentNode || head;
        }
      }
      return document.querySelector(".js-product-detail, .product-detail, .js-product-container, .product-container");
    };

    var pos = cfg.position || "after-description";
    var isBeforeDesc = pos === "before-description" || pos === "before_description";
    var isAfterDesc = pos === "after-description" || pos === "after_description";
    var isAfterPrice = pos === "after-price" || pos === "after_price";

    var injectPasos = function() {
      if (document.getElementById(id)) return true;

      var targetEl = null;
      var insertAfter = false;

      if (isAfterPrice) {
        var priceEl = document.querySelector(".js-price-container, .js-product-price-container, .product-price-container, .price-container, .js-item-price, [data-store='product-price']");
        if (priceEl) {
          targetEl = priceEl;
          insertAfter = true;
        }
      }

      if (!targetEl && (isBeforeDesc || isAfterDesc)) {
        var descEl = findDescriptionEl();
        if (descEl) {
          targetEl = descEl;
          insertAfter = isAfterDesc;
        }
      }

      if (!targetEl && isBeforeDesc) {
        var formEl = document.querySelector("form[action*='/cart/add'], .js-addtocart, .js-prod-form, form[action*='/comprar']");
        if (formEl) {
          targetEl = formEl;
          insertAfter = true;
        }
      }

      if (!targetEl) {
        var fallbackForm = document.querySelector("form[action*='/cart/add'], .js-addtocart");
        if (fallbackForm) {
          targetEl = fallbackForm;
          insertAfter = true;
        }
      }

      if (targetEl && targetEl.parentNode) {
        if (insertAfter) {
          targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
        } else {
          targetEl.parentNode.insertBefore(container, targetEl);
        }
        initScrollAnimation();
        return true;
      }
      return false;
    };

    var initScrollAnimation = function() {
      var items = container.querySelectorAll(".nvx-paso-item");
      var progressLine = container.querySelector(".nvx-pasos-progress-line");

      if ("IntersectionObserver" in window) {
        var completedSteps = 0;
        var totalSteps = items.length;

        var observer = new IntersectionObserver(function(entries) {
          for (var e = 0; e < entries.length; e++) {
            var entry = entries[e];
            if (entry.isIntersecting) {
              var target = entry.target;
              // Animamos el paso visible
              target.style.opacity = "1";
              target.style.transform = "translateX(0)";
              
              // Actualizamos la altura de la línea según el paso actual
              var idx = parseInt(target.getAttribute("data-nvx-step-idx"), 10);
              if (idx + 1 > completedSteps) {
                completedSteps = idx + 1;
                if (progressLine) {
                  var percent = (completedSteps / totalSteps) * 100;
                  progressLine.style.height = percent + "%";
                }
              }
              // Dejamos de observar este paso específico
              observer.unobserve(target);
            }
          }
        }, {
          rootMargin: "0px 0px -15% 0px", // Se dispara cuando el paso entra en el 15% inferior de la pantalla
          threshold: 0.1
        });

        for (var k = 0; k < items.length; k++) {
          items[k].setAttribute("data-nvx-step-idx", k);
          observer.observe(items[k]); // Observamos cada paso individualmente
        }
      } else {
        for (var m = 0; m < items.length; m++) {
          items[m].style.opacity = "1";
          items[m].style.transform = "translateX(0)";
        }
        if (progressLine) progressLine.style.height = "100%";
      }
    };

    var done = injectPasos();
    if (!done) {
      setTimeout(injectPasos, 500);
      setTimeout(injectPasos, 1200);
    }
  };
              /* ═══════════════════════════════════════════
     WIDGET #33: INFORMACIÓN DE ENVÍO (🚚)
     ═══════════════════════════════════════════ */
  var renderInformacionEnvio = function(w) {
    if (detectPageType() !== "product") return;
    var id = "nvx-info-envio-" + w.id;
    if (document.getElementById(id)) return;

    var cfg = w.config || {};
    var zones = cfg.zones || [
      { id: "zone-1", name: "AMBA", dispatchDays: 1, deliveryDays: 1 },
      { id: "zone-2", name: "Resto del país", dispatchDays: 1, deliveryDays: 3 }
    ];
    if (zones.length === 0) return;

    var container = document.createElement("div");
    container.id = id;
    container.className = "nvx-info-envio-container";
    container.style.cssText = "width: 100% !important; box-sizing: border-box !important; margin: " + (cfg.marginTop || 16) + "px 0 " + (cfg.marginBottom || 16) + "px 0 !important; clear: both !important; display: block !important;";

    // Cálculo dinámico de fechas con hora de corte
    var months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    var now = new Date();
    var cutoffStr = cfg.cutoffTime || "18:00";
    var cutoffParts = cutoffStr.split(":");
    var cutoffHour = parseInt(cutoffParts[0], 10) || 18;
    var cutoffMin = parseInt(cutoffParts[1], 10) || 0;

    var isAfterCutoff = false;
    if (now.getHours() > cutoffHour || (now.getHours() === cutoffHour && now.getMinutes() >= cutoffMin)) {
      isAfterCutoff = true;
    }

    var getFormattedDate = function(addDays) {
      var d = new Date();
      var extra = addDays + (isAfterCutoff ? 1 : 0);
      d.setDate(d.getDate() + extra);

      if (cfg.skipSaturdays !== false) {
        if (d.getDay() === 6) d.setDate(d.getDate() + 2); // Sábado -> Lunes
        else if (d.getDay() === 0) d.setDate(d.getDate() + 1); // Domingo -> Lunes
      }

      return {
        dayNum: d.getDate(),
        monthStr: months[d.getMonth()]
      };
    };

    var inner = "";

    if (cfg.title) {
      inner += '<div style="font-size: ' + (cfg.titleSize || 22) + 'px !important; font-weight: 800 !important; color: ' + (cfg.titleColor || "#191919") + ' !important; text-align: center !important; margin-bottom: 10px !important;">' + cfg.title + '</div>';
    }

    var bgColor = cfg.bgColor || "#d9f5e4";
    var textColor = cfg.textColor || "#1f6b4e";
    var badgeBg = cfg.badgeBgColor || "#dc3545";
    var badgeText = cfg.badgeTextColor || "#ffffff";
    var showBorder = cfg.showBorder !== false;
    var borderColor = cfg.borderColor || "#a7f3d0";
    var borderRadius = typeof cfg.borderRadius === "number" ? cfg.borderRadius : 16;
    var padding = typeof cfg.padding === "number" ? cfg.padding : 20;

    inner += '<div style="background-color: ' + bgColor + ' !important; border-radius: ' + borderRadius + 'px !important; padding: ' + padding + 'px !important; max-width: 550px !important; margin: 0 auto !important; border: ' + (showBorder ? "1.5px solid " + borderColor : "none") + ' !important; box-shadow: 0 4px 12px rgba(0,0,0,0.04) !important; font-family: system-ui, -apple-system, sans-serif !important;">';

    // Handler global para cambiar de zona si hay varias
    if (!window.nvxSwitchShippingZone) {
      window.nvxSwitchShippingZone = function(widgetId, zoneIndex) {
        var parent = document.getElementById("nvx-info-envio-" + widgetId);
        if (!parent) return;
        var zoneContents = parent.querySelectorAll(".nvx-zone-content");
        var zoneButtons = parent.querySelectorAll(".nvx-zone-btn");
        for (var b = 0; b < zoneButtons.length; b++) {
          if (b === zoneIndex) {
            zoneButtons[b].style.backgroundColor = textColor;
            zoneButtons[b].style.color = bgColor;
            zoneButtons[b].style.borderColor = textColor;
          } else {
            zoneButtons[b].style.backgroundColor = "rgba(255,255,255,0.6)";
            zoneButtons[b].style.color = textColor;
            zoneButtons[b].style.borderColor = "transparent";
          }
        }
        for (var z = 0; z < zoneContents.length; z++) {
          if (z === zoneIndex) {
            zoneContents[z].style.display = "block";
          } else {
            zoneContents[z].style.display = "none";
          }
        }
      };
    }

    // Tabs de Zonas (solo si hay más de 1)
    if (zones.length > 1) {
      inner += '<div style="display: flex !important; gap: 6px !important; margin-bottom: 16px !important; justify-content: center !important; flex-wrap: wrap !important;">';
      for (var zIdx = 0; zIdx < zones.length; zIdx++) {
        var isFirst = zIdx === 0;
        inner += '<button type="button" class="nvx-zone-btn" onclick="window.nvxSwitchShippingZone(\'' + w.id + '\', ' + zIdx + ')" style="padding: 4px 12px !important; border-radius: 999px !important; font-size: 11px !important; font-weight: 800 !important; border: 1px solid ' + (isFirst ? textColor : "transparent") + ' !important; background-color: ' + (isFirst ? textColor : "rgba(255,255,255,0.6)") + ' !important; color: ' + (isFirst ? bgColor : textColor) + ' !important; cursor: pointer !important; transition: all 0.2s ease !important;">' + zones[zIdx].name + '</button>';
      }
      inner += '</div>';
    }

    // Contenido de cada Zona
    for (var i = 0; i < zones.length; i++) {
      var zn = zones[i];
      var isVisible = i === 0;

      var dispatchDate = getFormattedDate(zn.dispatchDays || 0);
      var totalDays = (zn.dispatchDays || 0) + (zn.deliveryDays || 0);
      var deliveryDate1 = getFormattedDate(totalDays);
      var deliveryDate2 = getFormattedDate(totalDays + 1);

      var dispatchText = zn.dispatchDays === 0 ? "Hoy" : zn.dispatchDays === 1 ? "Mañana" : dispatchDate.dayNum + " " + dispatchDate.monthStr;
      var deliveryText = cfg.showDateRange !== false
        ? deliveryDate1.dayNum + " y " + deliveryDate2.dayNum + " " + deliveryDate2.monthStr
        : deliveryDate1.dayNum + " " + deliveryDate1.monthStr;

      inner += '<div class="nvx-zone-content" style="display: ' + (isVisible ? "block" : "none") + ' !important;">';
      inner += '<div style="display: flex !important; align-items: center !important; justify-content: space-between !important; gap: 8px !important; text-align: center !important;">';

      // PASO 1: COMPRA
      inner += '<div style="flex: 1 !important; display: flex !important; flex-direction: column !important; align-items: center !important; gap: 4px !important;">';
      inner += '<span style="font-size: 20px !important;">📦</span>';
      inner += '<span style="font-size: ' + (cfg.labelSize || 14) + 'px !important; font-weight: 800 !important; color: ' + textColor + ' !important;">Compra</span>';
      inner += '<span style="font-size: ' + (cfg.daySize || 13) + 'px !important; font-weight: 700 !important; color: ' + textColor + ' !important; opacity: 0.9 !important;">Hoy</span>';
      if (cfg.showCutoffBadge !== false) {
        inner += '<span style="font-size: 9px !important; font-weight: 800 !important; background-color: ' + badgeBg + ' !important; color: ' + badgeText + ' !important; padding: 2px 6px !important; border-radius: 4px !important; margin-top: 2px !important; text-transform: uppercase !important;">ANTES DE LAS ' + cutoffStr + '</span>';
      }
      inner += '</div>';

      // SEPARADOR 1
      inner += '<div style="width: 24px !important; height: 2px !important; background-color: ' + textColor + ' !important; opacity: 0.35 !important; border-radius: 2px !important;"></div>';

      // PASO 2: ENVÍO
      inner += '<div style="flex: 1 !important; display: flex !important; flex-direction: column !important; align-items: center !important; gap: 4px !important;">';
      inner += '<span style="font-size: 20px !important;">🚚</span>';
      inner += '<span style="font-size: ' + (cfg.labelSize || 14) + 'px !important; font-weight: 800 !important; color: ' + textColor + ' !important;">Envío</span>';
      inner += '<span style="font-size: ' + (cfg.daySize || 13) + 'px !important; font-weight: 700 !important; color: ' + textColor + ' !important; opacity: 0.9 !important;">' + dispatchText + '</span>';
      inner += '</div>';

      // SEPARADOR 2
      inner += '<div style="width: 24px !important; height: 2px !important; background-color: ' + textColor + ' !important; opacity: 0.35 !important; border-radius: 2px !important;"></div>';

      // PASO 3: ENTREGA
      inner += '<div style="flex: 1 !important; display: flex !important; flex-direction: column !important; align-items: center !important; gap: 4px !important;">';
      inner += '<span style="font-size: 20px !important;">📍</span>';
      inner += '<span style="font-size: ' + (cfg.labelSize || 14) + 'px !important; font-weight: 800 !important; color: ' + textColor + ' !important;">Entrega</span>';
      inner += '<span style="font-size: ' + (cfg.daySize || 13) + 'px !important; font-weight: 700 !important; color: ' + textColor + ' !important; opacity: 0.9 !important;">' + deliveryText + '</span>';
      inner += '</div>';

      inner += '</div>'; // Fin flex row
      inner += '</div>'; // Fin nvx-zone-content
    }

    if (cfg.showApproxNote !== false) {
      inner += '<div style="font-size: 10px !important; color: ' + textColor + ' !important; text-align: center !important; margin-top: 12px !important; opacity: 0.75 !important;">ⓘ Las fechas mostradas son estimaciones aproximadas.</div>';
    }

    inner += '</div>'; // Fin contenedor prinicpal
    container.innerHTML = inner;

    // Buscador DOM de 3 niveles para Descripción
    var findDescriptionEl = function() {
      var selectors = [
        ".js-product-description",
        "[data-store='product-description']",
        ".product-description",
        "#description",
        ".description",
        ".user-content",
        ".js-product-tabs",
        ".product-detail-description",
        ".js-product-description-container",
        "#product-description",
        ".product-description-container",
        ".product-tabs",
        ".js-tab-container"
      ];
      for (var s = 0; s < selectors.length; s++) {
        var el = document.querySelector(selectors[s]);
        if (el) return el;
      }
      var headers = document.querySelectorAll("h2, h3, h4, .tab-header, .accordion-header, .js-accordion-toggle, [data-tab]");
      for (var h = 0; h < headers.length; h++) {
        var head = headers[h];
        if (head && head.textContent && head.textContent.toLowerCase().indexOf("descripci") !== -1) {
          return head.parentNode || head;
        }
      }
      return document.querySelector(".js-product-detail, .product-detail, .js-product-container, .product-container");
    };

    var pos = cfg.position || "before-description";
    var isBeforeDesc = pos === "before-description" || pos === "before_description";
    var isAfterDesc = pos === "after-description" || pos === "after_description";
    var isAfterPrice = pos === "after-price" || pos === "after_price";

    var injectInfoEnvio = function() {
      if (document.getElementById(id)) return true;

      var targetEl = null;
      var insertAfter = false;

      if (isAfterPrice) {
        var priceEl = document.querySelector(".js-price-container, .js-product-price-container, .product-price-container, .price-container, .js-item-price, [data-store='product-price']");
        if (priceEl) {
          targetEl = priceEl;
          insertAfter = true;
        }
      }

      if (!targetEl && (isBeforeDesc || isAfterDesc)) {
        var descEl = findDescriptionEl();
        if (descEl) {
          targetEl = descEl;
          insertAfter = isAfterDesc;
        }
      }

      // Fallback para "Antes de la descripción": pegar debajo del botón/formulario de compra (Regla #56)
      if (!targetEl && isBeforeDesc) {
        var formEl = document.querySelector("form[action*='/cart/add'], .js-addtocart, .js-prod-form, form[action*='/comprar']");
        if (formEl) {
          targetEl = formEl;
          insertAfter = true;
        }
      }

      // Fallback universal
      if (!targetEl) {
        var fallbackForm = document.querySelector("form[action*='/cart/add'], .js-addtocart");
        if (fallbackForm) {
          targetEl = fallbackForm;
          insertAfter = true;
        }
      }

      if (targetEl && targetEl.parentNode) {
        if (insertAfter) {
          targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
        } else {
          targetEl.parentNode.insertBefore(container, targetEl);
        }
        return true;
      }
      return false;
    };

    var done = injectInfoEnvio();
    if (!done) {
      setTimeout(injectInfoEnvio, 500);
      setTimeout(injectInfoEnvio, 1200);
    }
  };
  /* ═══════════════════════════════════════════
   WIDGET #34: PESTAÑAS DE INFORMACIÓN
   ═══════════════════════════════════════════ */
function renderPestanasInformacion(w) {
  try {
    var cfg = w.config || {};
    var uniqueId = "nvx-pestanas-info-" + (w.id || Math.random().toString(36).substring(7));
    if (document.getElementById(uniqueId)) return;

    var pageType = detectPageType();
    if (pageType !== "product") return;

    var tabs = cfg.tabs || cfg.pestanas || [];
    if (!Array.isArray(tabs) || tabs.length === 0) return;

    var position = cfg.position || cfg.ubicacion || "after-description";
    var activeTabBg = cfg.activeTabBg || cfg.activeBg || "#10B981";
    var activeTabColor = cfg.activeTabColor || cfg.activeColor || "#ffffff";
    var inactiveTabBg = cfg.inactiveTabBg || "transparent";
    var inactiveTabColor = cfg.inactiveTabColor || "#6b7280";
    var borderColor = cfg.borderColor || "#e5e7eb";
    var contentBg = cfg.contentBg || "#ffffff";
    var contentColor = cfg.contentColor || "#374151";

    var campaignTheme = cfg.campaignTheme || "none";
    if (campaignTheme && campaignTheme !== "none") {
      if (campaignTheme === "black-friday") { activeTabBg = "#F59E0B"; activeTabColor = "#111827"; borderColor = "#D97706"; }
      else if (campaignTheme === "hot-sale") { activeTabBg = "#EF4444"; activeTabColor = "#ffffff"; borderColor = "#B91C1C"; }
      else if (campaignTheme === "cyber-monday") { activeTabBg = "#3B82F6"; activeTabColor = "#ffffff"; borderColor = "#1D4ED8"; }
      else if (campaignTheme === "navidad") { activeTabBg = "#064E3B"; activeTabColor = "#ffffff"; borderColor = "#047857"; }
      else if (campaignTheme === "san-valentin") { activeTabBg = "#831843"; activeTabColor = "#ffffff"; borderColor = "#9d174d"; }
      else if (campaignTheme === "dia-madre-padre") { activeTabBg = "#312E81"; activeTabColor = "#ffffff"; borderColor = "#4338ca"; }
      else if (campaignTheme === "liquidacion") { activeTabBg = "#7F1D1D"; activeTabColor = "#ffffff"; borderColor = "#991b1b"; }
    }

    var findDescriptionEl = function() {
      var selectors = [
        ".js-product-description",
        '[data-store="product-description"]',
        ".product-description",
        "#description",
        ".description",
        ".user-content",
        ".js-product-tabs",
        ".product-detail-description"
      ];
      for (var i = 0; i < selectors.length; i++) {
        var el = document.querySelector(selectors[i]);
        if (el) return el;
      }
      var headings = document.querySelectorAll("h2, h3, h4, .tab-header, .accordion-header, .js-accordion-toggle, [data-tab]");
      for (var j = 0; j < headings.length; j++) {
        var txt = (headings[j].textContent || "").toLowerCase();
        if (txt.indexOf("descripci") !== -1) return headings[j];
      }
      var fallbacks = [".js-product-detail", ".product-detail", ".js-product-container", ".product-container"];
      for (var k = 0; k < fallbacks.length; k++) {
        var fb = document.querySelector(fallbacks[k]);
        if (fb) return fb;
      }
      return null;
    };

    var inject = function() {
      if (document.getElementById(uniqueId)) return;

      var container = document.createElement("div");
      container.id = uniqueId;
      container.setAttribute("data-nevux-widget", "pestanas-informacion");
      container.style.cssText = "width: 100% !important; max-width: 100% !important; margin: 20px 0 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important; box-sizing: border-box !important;";

      var tabsBarHtml = '<div style="display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; overflow-y: hidden !important; gap: 0 !important; border-bottom: 2px solid ' + borderColor + ' !important; margin-bottom: 0 !important; scrollbar-width: thin !important; -webkit-overflow-scrolling: touch !important;">';
      for (var i = 0; i < tabs.length; i++) {
        var t = tabs[i] || {};
        var icon = t.icon || t.emoji || "";
        var name = t.name || t.title || t.label || ("Pestaña " + (i + 1));
        var isActive = (i === 0);
        tabsBarHtml += '<button type="button" data-nvx-tab-index="' + i + '" style="flex-shrink: 0 !important; cursor: pointer !important; border: none !important; outline: none !important; padding: 12px 18px !important; font-size: 14px !important; font-weight: 700 !important; font-family: inherit !important; background: ' + (isActive ? activeTabBg : inactiveTabBg) + ' !important; color: ' + (isActive ? activeTabColor : inactiveTabColor) + ' !important; border-radius: 8px 8px 0 0 !important; margin-bottom: -2px !important; border-bottom: 2px solid ' + (isActive ? activeTabBg : "transparent") + ' !important; transition: all 0.15s ease !important; white-space: nowrap !important; display: inline-flex !important; align-items: center !important; gap: 6px !important;">';
        if (icon) tabsBarHtml += '<span style="font-size: 16px !important;">' + icon + '</span>';
        tabsBarHtml += '<span>' + name + '</span></button>';
      }
      tabsBarHtml += '</div>';

      var contentsHtml = '';
      for (var j = 0; j < tabs.length; j++) {
        var tc = tabs[j] || {};
        var content = tc.content || tc.body || tc.text || "";
        var isActiveContent = (j === 0);
        contentsHtml += '<div data-nvx-tab-content="' + j + '" style="display: ' + (isActiveContent ? "block" : "none") + ' !important; padding: 20px 18px !important; background: ' + contentBg + ' !important; color: ' + contentColor + ' !important; font-size: 15px !important; line-height: 1.6 !important; border-radius: 0 0 8px 8px !important; border: 1px solid ' + borderColor + ' !important; border-top: none !important;">' + content + '</div>';
      }

      container.innerHTML = tabsBarHtml + contentsHtml;

      var targetEl = null;
      var descEl = findDescriptionEl();

      if (position === "before-description" && descEl) {
        descEl.parentNode.insertBefore(container, descEl);
      } else if (position === "after-price") {
        var priceContainers = [
          ".js-price-container",
          ".js-product-price-container",
          ".product-price-container",
          ".price-container",
          ".js-item-price",
          '[data-store="product-price"]'
        ];
        for (var p = 0; p < priceContainers.length; p++) {
          var pe = document.querySelector(priceContainers[p]);
          if (pe) { targetEl = pe; break; }
        }
        if (targetEl && targetEl.parentNode) {
          targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
        } else if (descEl) {
          descEl.parentNode.insertBefore(container, descEl);
        }
      } else {
        if (descEl && descEl.parentNode) {
          descEl.parentNode.insertBefore(container, descEl.nextSibling);
        } else {
          var fallback = document.querySelector(".js-product-detail, .product-detail, .js-product-container, .product-container, main");
          if (fallback) fallback.appendChild(container);
        }
      }

      var tabButtons = container.querySelectorAll("button[data-nvx-tab-index]");
      var tabContents = container.querySelectorAll("div[data-nvx-tab-content]");

      var activateTab = function(idx) {
        for (var a = 0; a < tabButtons.length; a++) {
          var btn = tabButtons[a];
          var btnIdx = parseInt(btn.getAttribute("data-nvx-tab-index"), 10);
          if (btnIdx === idx) {
            btn.style.setProperty("background", activeTabBg, "important");
            btn.style.setProperty("color", activeTabColor, "important");
            btn.style.setProperty("border-bottom", "2px solid " + activeTabBg, "important");
          } else {
            btn.style.setProperty("background", inactiveTabBg, "important");
            btn.style.setProperty("color", inactiveTabColor, "important");
            btn.style.setProperty("border-bottom", "2px solid transparent", "important");
          }
        }
        for (var b = 0; b < tabContents.length; b++) {
          var ct = tabContents[b];
          var ctIdx = parseInt(ct.getAttribute("data-nvx-tab-content"), 10);
          ct.style.setProperty("display", ctIdx === idx ? "block" : "none", "important");
        }
      };

      for (var t2 = 0; t2 < tabButtons.length; t2++) {
        (function(button) {
          button.addEventListener("click", function(ev) {
            ev.preventDefault();
            var idx = parseInt(button.getAttribute("data-nvx-tab-index"), 10);
            activateTab(idx);
          });
        })(tabButtons[t2]);
      }
    };

    inject();
    setTimeout(inject, 500);
    setTimeout(inject, 1500);
  } catch (err) {
    if (window.console && window.console.warn) {
      window.console.warn("[Nevux] renderPestanasInformacion error:", err);
    }
  }
      }
      /* ═══════════════════════════════════════════
   WIDGET #35: IMÁGENES Y TEXTOS (DISEÑO OPTIMIZADO)
   ═══════════════════════════════════════════ */
function renderImagenesTextos(w) {
  try {
    var cfg = w.config || {};
    var uniqueId = "nvx-img-txt-" + (w.id || Math.random().toString(36).substring(7));
    if (document.getElementById(uniqueId)) return;

    var pageType = detectPageType();
    if (pageType !== "product") return;

    var sections = cfg.sections || [];
    if (!Array.isArray(sections) || sections.length === 0) return;

    var position = cfg.position || "after-description";
    var imageRadius = cfg.imageRadius || "8px";
    var badgeBg = cfg.badgeBg || "#111827";
    var badgeColor = cfg.badgeColor || "#ffffff";
    var h2Size = cfg.h2Size || 20;
    var textSize = cfg.textSize || 15;

    var campaignTheme = cfg.campaignTheme || "none";
    if (campaignTheme && campaignTheme !== "none") {
      if (campaignTheme === "black-friday") { badgeBg = "#F59E0B"; badgeColor = "#111827"; }
      else if (campaignTheme === "hot-sale") { badgeBg = "#EF4444"; badgeColor = "#ffffff"; }
      else if (campaignTheme === "cyber-monday") { badgeBg = "#3B82F6"; badgeColor = "#ffffff"; }
      else if (campaignTheme === "navidad") { badgeBg = "#064E3B"; badgeColor = "#ffffff"; }
      else if (campaignTheme === "san-valentin") { badgeBg = "#831843"; badgeColor = "#ffffff"; }
      else if (campaignTheme === "dia-padre-madre") { badgeBg = "#312E81"; badgeColor = "#ffffff"; }
      else if (campaignTheme === "liquidacion") { badgeBg = "#7F1D1D"; badgeColor = "#ffffff"; }
    }

    var findDescriptionEl = function() {
      var selectors = [
        ".js-product-description",
        '[data-store="product-description"]',
        ".product-description",
        "#description",
        ".description",
        ".user-content",
        ".js-product-tabs",
        ".product-detail-description"
      ];
      for (var i = 0; i < selectors.length; i++) {
        var el = document.querySelector(selectors[i]);
        if (el) return el;
      }
      var headings = document.querySelectorAll("h2, h3, h4, .tab-header, .accordion-header, .js-accordion-toggle, [data-tab]");
      for (var j = 0; j < headings.length; j++) {
        var txt = (headings[j].textContent || "").toLowerCase();
        if (txt.indexOf("descripci") !== -1) return headings[j];
      }
      var fallbacks = [".js-product-detail", ".product-detail", ".js-product-container", ".product-container"];
      for (var k = 0; k < fallbacks.length; k++) {
        var fb = document.querySelector(fallbacks[k]);
        if (fb) return fb;
      }
      return null;
    };

    var inject = function() {
      if (document.getElementById(uniqueId)) return;

      var container = document.createElement("div");
      container.id = uniqueId;
      container.setAttribute("data-nevux-widget", "imagenes-textos");
      container.style.cssText = "width: 100% !important; max-width: 100% !important; margin: 24px 0 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important; box-sizing: border-box !important;";

      var cssStyle = '<style>' +
        'html body #' + uniqueId + ' .nvx-sec-card {' +
        '  display: flex !important;' +
        '  align-items: center !important;' +
        '  justify-content: space-between !important;' +
        '  gap: 20px !important;' +
        '  padding: 18px !important;' +
        '  border-radius: 12px !important;' +
        '  margin-bottom: 16px !important;' +
        '  box-sizing: border-box !important;' +
        '  width: 100% !important;' +
        '  max-width: 100% !important;' +
        '  overflow: hidden !important;' +
        '}' +
        'html body #' + uniqueId + ' .nvx-sec-img-col {' +
        '  flex: 0 0 150px !important;' +
        '  max-width: 150px !important;' +
        '  width: 150px !important;' +
        '  display: flex !important;' +
        '  justify-content: center !important;' +
        '  align-items: center !important;' +
        '  min-width: 0 !important;' +
        '}' +
        'html body #' + uniqueId + ' .nvx-sec-txt-col {' +
        '  flex: 1 1 0% !important;' +
        '  min-width: 0 !important;' +
        '  display: flex !important;' +
        '  flex-direction: column !important;' +
        '  justify-content: center !important;' +
        '  gap: 8px !important;' +
        '  word-break: break-word !important;' +
        '  overflow-wrap: break-word !important;' +
        '}' +
        '@media (max-width: 640px) {' +
        '  html body #' + uniqueId + ' .nvx-sec-card {' +
        '    flex-direction: column !important;' +
        '    text-align: center !important;' +
        '    gap: 16px !important;' +
        '    padding: 16px !important;' +
        '  }' +
        '  html body #' + uniqueId + ' .nvx-sec-img-col {' +
        '    flex: 0 0 auto !important;' +
        '    max-width: 160px !important;' +
        '    width: 100% !important;' +
        '  }' +
        '  html body #' + uniqueId + ' .nvx-sec-txt-col {' +
        '    align-items: center !important;' +
        '    text-align: center !important;' +
        '    width: 100% !important;' +
        '  }' +
        '  html body #' + uniqueId + ' .nvx-sec-badge {' +
        '    align-self: center !important;' +
        '  }' +
        '}' +
        '</style>';

      var html = cssStyle + '<div style="display: flex !important; flex-direction: column !important; gap: 16px !important; width: 100% !important;">';

      for (var i = 0; i < sections.length; i++) {
        var sec = sections[i] || {};
        var isRight = sec.imagePosition === "right";
        var bg = sec.bgColor || "#ffffff";
        var img = sec.image || "";
        var badge = sec.badgeText || "";
        var title = sec.title || "";
        var content = sec.content || "";

        var flexDir = isRight ? "row-reverse" : "row";

        html += '<div class="nvx-sec-card" style="background-color: ' + bg + ' !important; flex-direction: ' + flexDir + ' !important; border: 1px solid #e5e7eb !important;">';

        // Columna Imagen (Más compacta)
        html += '<div class="nvx-sec-img-col">';
        if (img) {
          html += '<img src="' + img + '" alt="' + title + '" style="width: 100% !important; max-width: 150px !important; height: auto !important; max-height: 150px !important; object-fit: cover !important; border-radius: ' + imageRadius + ' !important; display: block !important;" />';
        } else {
          html += '<div style="width: 120px !important; height: 120px !important; background: #e5e7eb !important; border-radius: ' + imageRadius + ' !important; display: flex !important; align-items: center !important; justify-content: center !important; color: #9ca3af !important; font-size: 28px !important;">🖼️</div>';
        }
        html += '</div>';

        // Columna Texto (Centrado y contenido dentro de la caja)
        html += '<div class="nvx-sec-txt-col">';
        if (badge) {
          html += '<span class="nvx-sec-badge" style="display: inline-block !important; align-self: flex-start; background-color: ' + badgeBg + ' !important; color: ' + badgeColor + ' !important; padding: 4px 10px !important; border-radius: 6px !important; font-size: 11px !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important;">' + badge + '</span>';
        }
        if (title) {
          html += '<div style="font-size: ' + h2Size + 'px !important; font-weight: 800 !important; color: #111827 !important; line-height: 1.3 !important; margin: 0 !important;">' + title + '</div>';
        }
        if (content) {
          html += '<div style="font-size: ' + textSize + 'px !important; color: #374151 !important; line-height: 1.6 !important; word-break: break-word !important; overflow-wrap: break-word !important; white-space: pre-wrap !important; margin: 0 !important;">' + content + '</div>';
        }
        html += '</div>';

        html += '</div>';
      }

      html += '</div>';
      container.innerHTML = html;

      var descEl = findDescriptionEl();
      if (position === "before-description" && descEl) {
        descEl.parentNode.insertBefore(container, descEl);
      } else {
        if (descEl && descEl.parentNode) {
          descEl.parentNode.insertBefore(container, descEl.nextSibling);
        } else {
          var fallback = document.querySelector(".js-product-detail, .product-detail, .js-product-container, .product-container, main");
          if (fallback) fallback.appendChild(container);
        }
      }
    };

    inject();
    setTimeout(inject, 500);
    setTimeout(inject, 1500);
  } catch (err) {
    if (window.console && window.console.warn) {
      window.console.warn("[Nevux] renderImagenesTextos error:", err);
    }
  }
        }      
        /* ═══════════════════════════════════════════
   WIDGET #36: COLUMNAS DE IMÁGENES Y TEXTO
   ═══════════════════════════════════════════ */
function renderColumnasImagenesTexto(w) {
  try {
    var cfg = w.config || {};
    var uniqueId = "nvx-col-img-txt-" + (w.id || Math.random().toString(36).substring(7));
    if (document.getElementById(uniqueId)) return;

    var pageType = detectPageType();
    if (pageType !== "product") return;

    var cards = cfg.cards || [];
    if (!Array.isArray(cards) || cards.length === 0) return;

    var sectionTitle = cfg.sectionTitle || "";
    var sectionSubtitle = cfg.sectionSubtitle || "";
    var position = cfg.position || "after-description";
    var columnsDesktop = cfg.columnsDesktop || 3;
    var cardRadius = cfg.cardRadius === "square" ? "0px" : "12px";
    var cardAlign = cfg.cardAlign || "center";
    var mobileLayout = cfg.mobileLayout || "scroll";

    var sectionBg = cfg.sectionBg || "#fafafa";
    var cardBg = cfg.cardBg || "#ffffff";
    var sectionTitleColor = cfg.sectionTitleColor || "#191919";
    var sectionSubtitleColor = cfg.sectionSubtitleColor || "#5E5E5E";
    var cardTitleColor = cfg.cardTitleColor || "#191919";
    var cardSubtitleColor = cfg.cardSubtitleColor || "#5E5E5E";

    var sectionTitleSize = cfg.sectionTitleSize || 22;
    var sectionSubtitleSize = cfg.sectionSubtitleSize || 16;
    var cardTitleSize = cfg.cardTitleSize || 18;
    var cardSubtitleSize = cfg.cardSubtitleSize || 14;

    var badgeBg = cfg.badgeBg || "#191919";
    var badgeColor = cfg.badgeColor || "#ffffff";
    var badgeBorder = cfg.badgeBorder || "transparent";
    var badgeSize = cfg.badgeSize || 11;
    var badgeRounded = cfg.badgeRounded !== false ? "999px" : "4px";

    var campaignTheme = cfg.campaignTheme || "none";
    if (campaignTheme && campaignTheme !== "none") {
      if (campaignTheme === "black-friday") { badgeBg = "#F59E0B"; badgeColor = "#111827"; badgeBorder = "#D97706"; }
      else if (campaignTheme === "hot-sale") { badgeBg = "#EF4444"; badgeColor = "#ffffff"; badgeBorder = "#B91C1C"; }
      else if (campaignTheme === "cyber-monday") { badgeBg = "#3B82F6"; badgeColor = "#ffffff"; badgeBorder = "#1D4ED8"; }
      else if (campaignTheme === "navidad") { badgeBg = "#064E3B"; badgeColor = "#ffffff"; badgeBorder = "#047857"; }
      else if (campaignTheme === "san-valentin") { badgeBg = "#831843"; badgeColor = "#ffffff"; badgeBorder = "#9d174d"; }
      else if (campaignTheme === "dia-padre-madre") { badgeBg = "#312E81"; badgeColor = "#ffffff"; badgeBorder = "#4338ca"; }
      else if (campaignTheme === "liquidacion") { badgeBg = "#7F1D1D"; badgeColor = "#ffffff"; badgeBorder = "#991b1b"; }
    }

    var findDescriptionEl = function() {
      var selectors = [
        ".js-product-description",
        '[data-store="product-description"]',
        ".product-description",
        "#description",
        ".description",
        ".user-content",
        ".js-product-tabs",
        ".product-detail-description"
      ];
      for (var i = 0; i < selectors.length; i++) {
        var el = document.querySelector(selectors[i]);
        if (el) return el;
      }
      var headings = document.querySelectorAll("h2, h3, h4, .tab-header, .accordion-header, .js-accordion-toggle, [data-tab]");
      for (var j = 0; j < headings.length; j++) {
        var txt = (headings[j].textContent || "").toLowerCase();
        if (txt.indexOf("descripci") !== -1) return headings[j];
      }
      var fallbacks = [".js-product-detail", ".product-detail", ".js-product-container", ".product-container"];
      for (var k = 0; k < fallbacks.length; k++) {
        var fb = document.querySelector(fallbacks[k]);
        if (fb) return fb;
      }
      return null;
    };

    var inject = function() {
      if (document.getElementById(uniqueId)) return;

      var container = document.createElement("div");
      container.id = uniqueId;
      container.setAttribute("data-nevux-widget", "columnas-imagenes-texto");
      container.style.cssText = "width: 100% !important; max-width: 100% !important; margin: 24px 0 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important; box-sizing: border-box !important;";

      var cssStyle = '<style>' +
        'html body #' + uniqueId + ' .nvx-col-wrapper {' +
        '  background-color: ' + sectionBg + ' !important;' +
        '  border-radius: 16px !important;' +
        '  padding: 24px 16px !important;' +
        '  box-sizing: border-box !important;' +
        '  width: 100% !important;' +
        '}' +
        'html body #' + uniqueId + ' .nvx-col-grid {' +
        '  display: grid !important;' +
        '  grid-template-columns: repeat(' + Math.min(columnsDesktop, cards.length) + ', minmax(0, 1fr)) !important;' +
        '  gap: 16px !important;' +
        '  width: 100% !important;' +
        '  box-sizing: border-box !important;' +
        '}' +
        'html body #' + uniqueId + ' .nvx-col-card {' +
        '  background-color: ' + cardBg + ' !important;' +
        '  border-radius: ' + cardRadius + ' !important;' +
        '  border: 1px solid #e5e7eb !important;' +
        '  padding: 16px !important;' +
        '  display: flex !important;' +
        '  flex-direction: column !important;' +
        '  align-items: ' + (cardAlign === "center" ? "center" : "flex-start") + ' !important;' +
        '  text-align: ' + (cardAlign === "center" ? "center" : "left") + ' !important;' +
        '  gap: 10px !important;' +
        '  box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;' +
        '  box-sizing: border-box !important;' +
        '  min-width: 0 !important;' +
        '}' +
        '@media (max-width: 640px) {' +
        (mobileLayout === "scroll"
          ? 'html body #' + uniqueId + ' .nvx-col-grid {' +
            '  display: flex !important;' +
            '  overflow-x: auto !important;' +
            '  scroll-snap-type: x mandatory !important;' +
            '  -webkit-overflow-scrolling: touch !important;' +
            '  padding-bottom: 8px !important;' +
            '  gap: 12px !important;' +
            '}' +
            'html body #' + uniqueId + ' .nvx-col-card {' +
            '  flex: 0 0 78% !important;' +
            '  min-width: 78% !important;' +
            '  scroll-snap-align: start !important;' +
            '}'
          : 'html body #' + uniqueId + ' .nvx-col-grid {' +
            '  display: flex !important;' +
            '  flex-direction: column !important;' +
            '  gap: 14px !important;' +
            '}' +
            'html body #' + uniqueId + ' .nvx-col-card {' +
            '  width: 100% !important;' +
            '}') +
        '}' +
        '</style>';

      var html = cssStyle + '<div class="nvx-col-wrapper">';

      if (sectionTitle || sectionSubtitle) {
        html += '<div style="text-align: center !important; margin-bottom: 20px !important; max-width: 600px !important; margin-left: auto !important; margin-right: auto !important;">';
        if (sectionTitle) {
          html += '<div style="font-size: ' + sectionTitleSize + 'px !important; font-weight: 800 !important; color: ' + sectionTitleColor + ' !important; line-height: 1.25 !important; margin: 0 0 6px 0 !important;">' + sectionTitle + '</div>';
        }
        if (sectionSubtitle) {
          html += '<div style="font-size: ' + sectionSubtitleSize + 'px !important; color: ' + sectionSubtitleColor + ' !important; line-height: 1.4 !important; margin: 0 !important;">' + sectionSubtitle + '</div>';
        }
        html += '</div>';
      }

      html += '<div class="nvx-col-grid">';

      for (var i = 0; i < cards.length; i++) {
        var c = cards[i] || {};
        var img = c.image || "";
        var title = c.title || "";
        var badge = c.badge || "";
        var subtitle = c.subtitle || "";

        html += '<div class="nvx-col-card">';

        if (img) {
          html += '<img src="' + img + '" alt="' + title + '" style="width: 100% !important; aspectRatio: 1 / 1 !important; object-fit: cover !important; border-radius: ' + cardRadius + ' !important; display: block !important;" />';
        } else {
          html += '<div style="width: 100% !important; height: 120px !important; background: #e5e7eb !important; border-radius: ' + cardRadius + ' !important; display: flex !important; align-items: center !important; justify-content: center !important; color: #9ca3af !important; font-size: 28px !important;">🖼️</div>';
        }

        if (badge) {
          html += '<span style="display: inline-block !important; background-color: ' + badgeBg + ' !important; color: ' + badgeColor + ' !important; border: 1px solid ' + badgeBorder + ' !important; padding: 3px 8px !important; border-radius: ' + badgeRounded + ' !important; font-size: ' + badgeSize + 'px !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: 0.3px !important;">' + badge + '</span>';
        }

        if (title) {
          html += '<div style="font-size: ' + cardTitleSize + 'px !important; font-weight: 800 !important; color: ' + cardTitleColor + ' !important; line-height: 1.25 !important; margin: 0 !important; width: 100% !important;">' + title + '</div>';
        }

        if (subtitle) {
          html += '<div style="font-size: ' + cardSubtitleSize + 'px !important; color: ' + cardSubtitleColor + ' !important; line-height: 1.4 !important; margin: 0 !important; width: 100% !important; word-break: break-word !important; overflow-wrap: break-word !important;">' + subtitle + '</div>';
        }

        html += '<' + '/div>';
      }

      html += '</div></div>';
      container.innerHTML = html;

      var descEl = findDescriptionEl();
      if (position === "before-description" && descEl) {
        descEl.parentNode.insertBefore(container, descEl);
      } else {
        if (descEl && descEl.parentNode) {
          descEl.parentNode.insertBefore(container, descEl.nextSibling);
        } else {
          var fallback = document.querySelector(".js-product-detail, .product-detail, .js-product-container, .product-container, main");
          if (fallback) fallback.appendChild(container);
        }
      }
    };

    inject();
    setTimeout(inject, 500);
    setTimeout(inject, 1500);
  } catch (err) {
    if (window.console && window.console.warn) {
      window.console.warn("[Nevux] renderColumnasImagenesTexto error:", err);
    }
  }
}
    /* ═══════════════════════════════════════════
   WIDGET #37: COMPARADOR DE MARCA
   ═══════════════════════════════════════════ */
function renderComparadorMarca(w) {
  try {
    var cfg = w.config || {};
    var uniqueId = "nvx-comp-brand-" + (w.id || Math.random().toString(36).substring(7));
    if (document.getElementById(uniqueId)) return;

    var pageType = detectPageType();
    if (pageType !== "product") return;

    var items = cfg.items || [];
    if (!Array.isArray(items) || items.length === 0) return;

    var sectionTitle = cfg.sectionTitle || "";
    var sectionSubtitle = cfg.sectionSubtitle || "";
    var brandUs = cfg.brandUs || "Nosotros";
    var brandUsLogo = cfg.brandUsLogo || "";
    var brandOthers = cfg.brandOthers || "Otros";
    var position = cfg.position || "after-description";

    var sectionBg = cfg.sectionBg || "#fafafa";
    var colUsBg = cfg.colUsBg || "#242424";
    var colUsText = cfg.colUsText || "#ffffff";
    var othersText = cfg.othersText || "#aaaaaa";
    var featureColor = cfg.featureColor || "#191919";
    var borderColor = cfg.borderColor || "#EFEFEF";

    var h2Size = cfg.h2Size || 22;
    var h3Size = cfg.h3Size || 18;
    var textSize = cfg.textSize || 15;

    var campaignTheme = cfg.campaignTheme || "none";
    if (campaignTheme && campaignTheme !== "none") {
      if (campaignTheme === "black-friday") { colUsBg = "#F59E0B"; colUsText = "#111827"; }
      else if (campaignTheme === "hot-sale") { colUsBg = "#EF4444"; colUsText = "#ffffff"; }
      else if (campaignTheme === "cyber-monday") { colUsBg = "#3B82F6"; colUsText = "#ffffff"; }
      else if (campaignTheme === "navidad") { colUsBg = "#064E3B"; colUsText = "#ffffff"; }
      else if (campaignTheme === "san-valentin") { colUsBg = "#831843"; colUsText = "#ffffff"; }
      else if (campaignTheme === "dia-padre-madre") { colUsBg = "#312E81"; colUsText = "#ffffff"; }
      else if (campaignTheme === "liquidacion") { colUsBg = "#7F1D1D"; colUsText = "#ffffff"; }
    }

    var findDescriptionEl = function() {
      var selectors = [
        ".js-product-description",
        '[data-store="product-description"]',
        ".product-description",
        "#description",
        ".description",
        ".user-content",
        ".js-product-tabs",
        ".product-detail-description"
      ];
      for (var i = 0; i < selectors.length; i++) {
        var el = document.querySelector(selectors[i]);
        if (el) return el;
      }
      var headings = document.querySelectorAll("h2, h3, h4, .tab-header, .accordion-header, .js-accordion-toggle, [data-tab]");
      for (var j = 0; j < headings.length; j++) {
        var txt = (headings[j].textContent || "").toLowerCase();
        if (txt.indexOf("descripci") !== -1) return headings[j];
      }
      var fallbacks = [".js-product-detail", ".product-detail", ".js-product-container", ".product-container"];
      for (var k = 0; k < fallbacks.length; k++) {
        var fb = document.querySelector(fallbacks[k]);
        if (fb) return fb;
      }
      return null;
    };

    var inject = function() {
      if (document.getElementById(uniqueId)) return;

      var container = document.createElement("div");
      container.id = uniqueId;
      container.setAttribute("data-nevux-widget", "comparador-marca");
      container.style.cssText = "width: 100% !important; max-width: 100% !important; margin: 24px 0 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important; box-sizing: border-box !important;";

      var cssStyle = '<style>' +
        'html body #' + uniqueId + ' .nvx-comp-wrapper {' +
        '  background-color: ' + sectionBg + ' !important;' +
        '  border-radius: 16px !important;' +
        '  padding: 24px 16px !important;' +
        '  box-sizing: border-box !important;' +
        '  width: 100% !important;' +
        '}' +
        'html body #' + uniqueId + ' .nvx-comp-table {' +
        '  max-width: 580px !important;' +
        '  margin: 0 auto !important;' +
        '  width: 100% !important;' +
        '  box-sizing: border-box !important;' +
        '}' +
        'html body #' + uniqueId + ' .nvx-comp-row {' +
        '  display: grid !important;' +
        '  grid-template-columns: 2fr 1.2fr 1fr !important;' +
        '  align-items: center !important;' +
        '  gap: 8px !important;' +
        '  box-sizing: border-box !important;' +
        '}' +
        '@media (max-width: 480px) {' +
        '  html body #' + uniqueId + ' .nvx-comp-wrapper {' +
        '    padding: 16px 10px !important;' +
        '  }' +
        '  html body #' + uniqueId + ' .nvx-comp-row {' +
        '    grid-template-columns: 1.8fr 1.2fr 1fr !important;' +
        '    gap: 4px !important;' +
        '  }' +
        '}' +
        '</style>';

      var html = cssStyle + '<div class="nvx-comp-wrapper">';

      if (sectionTitle || sectionSubtitle) {
        html += '<div style="text-align: center !important; margin-bottom: 20px !important; max-width: 520px !important; margin-left: auto !important; margin-right: auto !important;">';
        if (sectionTitle) {
          html += '<div style="font-size: ' + h2Size + 'px !important; font-weight: 800 !important; color: #111827 !important; line-height: 1.25 !important; margin: 0 0 6px 0 !important;">' + sectionTitle + '</div>';
        }
        if (sectionSubtitle) {
          html += '<div style="font-size: ' + textSize + 'px !important; color: #6B7280 !important; line-height: 1.4 !important; margin: 0 !important;">' + sectionSubtitle + '</div>';
        }
        html += '</div>';
      }

      html += '<div class="nvx-comp-table">';

      // Header Row
      html += '<div class="nvx-comp-row">';
      html += '<div></div>';
      html += '<div style="background-color: ' + colUsBg + ' !important; color: ' + colUsText + ' !important; border-radius: 12px 12px 0 0 !important; padding: 10px 8px !important; text-align: center !important; font-weight: 800 !important; font-size: ' + h3Size + 'px !important; box-shadow: 0 -2px 10px rgba(0,0,0,0.08) !important; display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; gap: 4px !important;">';
      if (brandUsLogo) {
        html += '<img src="' + brandUsLogo + '" alt="Logo" style="max-height: 24px !important; max-width: 80px !important; object-fit: contain !important; display: block !important;" />';
      }
      html += '<span>' + brandUs + '</span>';
      html += '</div>';
      html += '<div style="text-align: center !important; font-weight: 700 !important; font-size: ' + h3Size + 'px !important; color: ' + othersText + ' !important; padding: 10px 8px !important;">' + brandOthers + '</div>';
      html += '</div>';

      // Items Rows
      for (var i = 0; i < items.length; i++) {
        var item = items[i] || {};
        var isLast = i === items.length - 1;
        var feat = item.feature || "";
        var us = !!item.us;
        var others = !!item.others;

        var lastCardStyle = isLast ? ' border-radius: 0 0 12px 12px !important; box-shadow: 0 4px 10px rgba(0,0,0,0.08) !important;' : '';

        html += '<div class="nvx-comp-row" style="border-bottom: 1px solid ' + borderColor + ' !important;">';

        // Feature text
        html += '<div style="font-size: ' + textSize + 'px !important; font-weight: 600 !important; color: ' + featureColor + ' !important; padding: 10px 8px !important; line-height: 1.3 !important; word-break: break-word !important; overflow-wrap: break-word !important;">' + feat + '</div>';

        // Us Column
        html += '<div style="background-color: ' + colUsBg + ' !important; color: ' + colUsText + ' !important; padding: 10px 8px !important; text-align: center !important;' + lastCardStyle + '">';
        if (us) {
          html += '<span style="display: inline-flex !important; width: 22px !important; height: 22px !important; border-radius: 50% !important; background-color: #ffffff !important; color: ' + colUsBg + ' !important; align-items: center !important; justify-content: center !important; font-size: 12px !important; font-weight: 900 !important;">✓</span>';
        } else {
          html += '<span style="opacity: 0.4 !important; font-size: 14px !important;">✕</span>';
        }
        html += '</div>';

        // Others Column
        html += '<div style="text-align: center !important; padding: 10px 8px !important;">';
        if (others) {
          html += '<span style="color: #10B981 !important; font-size: 16px !important; font-weight: 800 !important;">✓</span>';
        } else {
          html += '<span style="color: #D1D5DB !important; font-size: 16px !important; font-weight: 800 !important;">✕</span>';
        }
        html += '</div>';

        html += '</div>';
      }

      html += '</div></div>';
      container.innerHTML = html;

      var descEl = findDescriptionEl();
      if (position === "before-description" && descEl) {
        descEl.parentNode.insertBefore(container, descEl);
      } else {
        if (descEl && descEl.parentNode) {
          descEl.parentNode.insertBefore(container, descEl.nextSibling);
        } else {
          var fallback = document.querySelector(".js-product-detail, .product-detail, .js-product-container, .product-container, main");
          if (fallback) fallback.appendChild(container);
        }
      }
    };

    inject();
    setTimeout(inject, 500);
    setTimeout(inject, 1500);
  } catch (err) {
    if (window.console && window.console.warn) {
      window.console.warn("[Nevux] renderComparadorMarca error:", err);
    }
  }
      }
        /* ═══════════════════════════════════════════
   WIDGET #38: VIDEO FLOTANTE
   ═══════════════════════════════════════════ */
function renderVideoFlotante(w) {
  try {
    if (!w || !w.config) return;
    var cfg = w.config || {};
    var uniqueId = "nvx-video-flotante-" + (w.id || Math.random().toString(36).substring(7));
    if (document.getElementById(uniqueId)) return;

    var videos = cfg.videos || [];
    if (!Array.isArray(videos) || videos.length === 0) return;

    var position = cfg.position || "bottom-left";
    var buttonSize = cfg.buttonSize || 110;
    var buttonRadius = cfg.buttonRadius || 90;
    var buttonFormat = cfg.buttonFormat || "square";
    var showPlayIcon = cfg.showPlayIcon !== false;
    var showCloseIcon = cfg.showCloseIcon !== false;
    var closeIconColor = cfg.closeIconColor || "#191919";
    var closeIconSize = cfg.closeIconSize || 14;
    var animation = cfg.animation || "pulse";
    var ctaBgColor = cfg.ctaBgColor || "#10B981";
    var ctaTextColor = cfg.ctaTextColor || "#ffffff";

    var firstVid = videos[0] || {};
    var vUrl = firstVid.url || "";
    var vTitle = firstVid.title || "";
    var ctaText = firstVid.buttonText || "Comprar ahora";

    var btnWidth = buttonFormat === "vertical" ? Math.round(buttonSize * 0.75) : buttonSize;

    var posStyles = "";
    if (position === "bottom-left") posStyles = "bottom: 20px !important; left: 20px !important;";
    else if (position === "bottom-right") posStyles = "bottom: 20px !important; right: 20px !important;";
    else if (position === "top-left") posStyles = "top: 20px !important; left: 20px !important;";
    else if (position === "top-right") posStyles = "top: 20px !important; right: 20px !important;";
    else if (position === "middle-left") posStyles = "top: 50% !important; left: 20px !important; transform: translateY(-50%) !important;";
    else if (position === "middle-right") posStyles = "top: 50% !important; right: 20px !important; transform: translateY(-50%) !important;";

    var animClass = "";
    var animCssId = "nvx-vf-anim-css";
    if (!document.getElementById(animCssId)) {
      var st = document.createElement("style");
      st.id = animCssId;
      st.innerHTML =
        "@keyframes nvxVFPulse { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.6); } 70% { box-shadow: 0 0 0 15px rgba(16,185,129,0); } 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); } }" +
        "@keyframes nvxVFBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }" +
        ".nvx-vf-pulse { animation: nvxVFPulse 2s infinite !important; }" +
        ".nvx-vf-bounce { animation: nvxVFBounce 2s infinite !important; }";
      document.head.appendChild(st);
    }
    if (animation === "pulse") animClass = "nvx-vf-pulse";
    else if (animation === "bounce") animClass = "nvx-vf-bounce";

    var container = document.createElement("div");
    container.id = uniqueId;
    container.setAttribute("data-nevux-widget", "video-flotante");
    container.style.cssText = "position: fixed !important; z-index: 999990 !important; " + posStyles;

    var html = '<div id="' + uniqueId + '-btn" class="' + animClass + '" style="position: relative !important; width: ' + btnWidth + 'px !important; height: ' + buttonSize + 'px !important; border-radius: ' + buttonRadius + 'px !important; background: #111827 !important; cursor: pointer !important; overflow: hidden !important; box-shadow: 0 10px 25px rgba(0,0,0,0.35) !important; display: flex !important; align-items: center !important; justify-content: center !important;">';
    if (vUrl) {
      html += '<video src="' + vUrl + '" style="width: 100% !important; height: 100% !important; object-fit: cover !important;" autoplay loop muted playsinline></video>';
    } else {
      html += '<div style="font-size: 28px !important;">🎬</div>';
    }
    if (showPlayIcon) {
      html += '<div style="position: absolute !important; width: 36px !important; height: 36px !important; border-radius: 50% !important; background: rgba(255,255,255,0.92) !important; display: flex !important; align-items: center !important; justify-content: center !important; color: #111 !important; font-size: 14px !important; font-weight: 800 !important; pointer-events: none !important; box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;">▶</div>';
    }
    if (showCloseIcon) {
      var cs = Math.round(closeIconSize * 1.8);
      html += '<div id="' + uniqueId + '-close" style="position: absolute !important; top: 4px !important; left: 4px !important; width: ' + cs + 'px !important; height: ' + cs + 'px !important; border-radius: 50% !important; background: ' + closeIconColor + ' !important; color: #fff !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: ' + closeIconSize + 'px !important; font-weight: 800 !important; cursor: pointer !important; z-index: 10 !important;">✕</div>';
    }
    html += '</div>';

    container.innerHTML = html;
    document.body.appendChild(container);

    var btnEl = document.getElementById(uniqueId + "-btn");
    var closeEl = document.getElementById(uniqueId + "-close");

    if (closeEl) {
      closeEl.addEventListener("click", function (e) {
        e.stopPropagation();
        container.style.display = "none";
      });
    }

    if (btnEl) {
      btnEl.addEventListener("click", function (e) {
        if (closeEl && (e.target === closeEl || closeEl.contains(e.target))) return;
        if (typeof window.nvxOpenVideoModal === "function") {
          window.nvxOpenVideoModal(vUrl, vTitle, ctaText, ctaBgColor, ctaTextColor);
        }
      });
    }
  } catch (err) {
    if (window.console && window.console.warn) {
      window.console.warn("[Nevux] renderVideoFlotante error:", err);
    }
  }
}

// Helpers globales por si no fueron inicializados antes
if (typeof window.nvxOpenVideoModal !== "function") {
  window.nvxOpenVideoModal = function (url, title, ctaText, ctaBg, ctaColor) {
    var modalId = "nvx-video-modal-overlay";
    var existing = document.getElementById(modalId);
    if (existing) existing.remove();

    var overlay = document.createElement("div");
    overlay.id = modalId;
    overlay.style.cssText = "position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(0,0,0,0.85) !important; z-index: 999999 !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 16px !important; box-sizing: border-box !important;";

    var content = "";
    content += '<div style="position: relative !important; width: 100% !important; max-width: 380px !important; height: 80vh !important; max-height: 680px !important; background: #000000 !important; border-radius: 16px !important; overflow: hidden !important; display: flex !important; flex-direction: column !important; box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;">';
    content += '<button type="button" onclick="document.getElementById(\'' + modalId + '\').remove();" style="position: absolute !important; top: 12px !important; right: 12px !important; z-index: 10 !important; background: rgba(0,0,0,0.6) !important; color: #fff !important; border: none !important; width: 32px !important; height: 32px !important; border-radius: 50% !important; font-size: 16px !important; font-weight: 800 !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important;">✕</button>';
    content += '<video src="' + url + '" style="width: 100% !important; height: 100% !important; object-fit: cover !important;" autoplay controls playsinline></video>';
    if (ctaText) {
      content += '<div style="position: absolute !important; bottom: 16px !important; left: 16px !important; right: 16px !important; z-index: 10 !important;">';
      content += '<button type="button" onclick="window.nvxSubmitVideoCta();" style="width: 100% !important; background: ' + (ctaBg || "#111827") + ' !important; color: ' + (ctaColor || "#ffffff") + ' !important; border: none !important; border-radius: 999px !important; padding: 14px !important; font-size: 15px !important; font-weight: 800 !important; cursor: pointer !important; box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;">' + ctaText + '</button>';
      content += '</div>';
    }
    content += '</div>';

    overlay.innerHTML = content;
    document.body.appendChild(overlay);
  };
}

if (typeof window.nvxSubmitVideoCta !== "function") {
  window.nvxSubmitVideoCta = function () {
    var modal = document.getElementById("nvx-video-modal-overlay");
    if (modal) modal.remove();

    var buyBtn = document.querySelector("button.js-add-to-cart-btn, form[action*='/cart/add'] button[type='submit'], .js-product-buy-container button, .product-buy-container button, #add-to-cart-button");
    if (buyBtn) {
      buyBtn.click();
    } else {
      var form = document.querySelector("form[action*='/cart/add'], form.js-product-form");
      if (form) form.submit();
    }
  };
        }
          /* ═══════════════════════════════════════════
   WIDGET #39: BOTÓN DE WHATSAPP
   ═══════════════════════════════════════════ */
function renderBotonWhatsapp(w) {
  try {
    if (!w || !w.config) return;
    var cfg = w.config || {};
    var uniqueId = "nvx-btn-wa-" + (w.id || Math.random().toString(36).substring(7));
    if (document.getElementById(uniqueId)) return;

    var agentName = cfg.agentName || "Luana";
    var agentRole = cfg.agentRole || "Atención al cliente";
    var message = cfg.message || "Hola, ¿Cómo podemos ayudarte?";
    var avatarUrl = cfg.avatarUrl || "";
    var hideAvatar = !!cfg.hideAvatar;
    var showPopupAuto = cfg.showPopupAuto !== false;
    var popupDelay = (cfg.popupDelay || 5) * 1000;
    var popupFrequency = cfg.popupFrequency || "once";
    var buttonText = cfg.buttonText || "Empezar chat";
    var whatsappNumber = (cfg.whatsappNumber || "541100000000").replace(/[^0-9]/g, "");
    var initialMessage = cfg.initialMessage || "Hola, quiero más información";
    var showNotificationDot = cfg.showNotificationDot !== false;

    var position = cfg.position || "bottom-right";
    var buttonColor = cfg.buttonColor || "#25D366";
    var headerColor = cfg.headerColor || "#25D366";
    var ctaColor = cfg.ctaColor || "#25D366";
    var dotColor = cfg.dotColor || "#E53E3E";
    var animation = cfg.animation || "pulse";
    var btnRounded = cfg.btnRounded !== false;
    var btnSize = cfg.btnSize || 68;
    var iconSize = cfg.iconSize || 32;

    var posStyles = "";
    var chatPosStyles = "";
    if (position === "bottom-right") {
      posStyles = "bottom: 20px !important; right: 20px !important;";
      chatPosStyles = "bottom: " + (btnSize + 30) + "px !important; right: 20px !important;";
    } else if (position === "bottom-left") {
      posStyles = "bottom: 20px !important; left: 20px !important;";
      chatPosStyles = "bottom: " + (btnSize + 30) + "px !important; left: 20px !important;";
    } else if (position === "top-right") {
      posStyles = "top: 20px !important; right: 20px !important;";
      chatPosStyles = "top: " + (btnSize + 30) + "px !important; right: 20px !important;";
    } else if (position === "top-left") {
      posStyles = "top: 20px !important; left: 20px !important;";
      chatPosStyles = "top: " + (btnSize + 30) + "px !important; left: 20px !important;";
    }

    var animClass = "";
    var animCssId = "nvx-wa-anim-css";
    if (!document.getElementById(animCssId)) {
      var st = document.createElement("style");
      st.id = animCssId;
      st.innerHTML =
        "@keyframes nvxWAPulse { 0% { box-shadow: 0 0 0 0 rgba(37,211,102,0.6); } 70% { box-shadow: 0 0 0 15px rgba(37,211,102,0); } 100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); } }" +
        "@keyframes nvxWABounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }" +
        ".nvx-wa-pulse { animation: nvxWAPulse 2s infinite !important; }" +
        ".nvx-wa-bounce { animation: nvxWABounce 2s infinite !important; }";
      document.head.appendChild(st);
    }

    if (animation === "pulse") animClass = "nvx-wa-pulse";
    else if (animation === "bounce") animClass = "nvx-wa-bounce";

    var container = document.createElement("div");
    container.id = uniqueId;
    container.setAttribute("data-nevux-widget", "boton-whatsapp");
    container.style.cssText = "position: fixed !important; z-index: 999990 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;";

    // Botón Flotante
    var html = '<div id="' + uniqueId + '-btn" class="' + animClass + '" style="position: fixed !important; width: ' + btnSize + 'px !important; height: ' + btnSize + 'px !important; border-radius: 50% !important; background-color: ' + buttonColor + ' !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: 0 6px 20px rgba(0,0,0,0.25) !important; z-index: 999991 !important; ' + posStyles + '">';
    html += '<svg width="' + iconSize + '" height="' + iconSize + '" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.38 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.38 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>';

    if (showNotificationDot) {
      html += '<span style="position: absolute !important; top: 2px !important; right: 2px !important; width: 14px !important; height: 14px !important; border-radius: 50% !important; background-color: ' + dotColor + ' !important; border: 2px solid #ffffff !important;"></span>';
    }
    html += '</div>';

    // Cuadro Modal de Chat
    var chatBoxId = uniqueId + "-chat";
    var chatHtml = '<div id="' + chatBoxId + '" style="display: none; position: fixed !important; width: min(320px, 88vw) !important; background-color: #ffffff !important; border-radius: 16px !important; overflow: hidden !important; box-shadow: 0 12px 35px rgba(0,0,0,0.2) !important; border: 1px solid #e5e7eb !important; z-index: 999992 !important; ' + chatPosStyles + '">';

    // Header Chat
    chatHtml += '<div style="background-color: ' + headerColor + ' !important; color: #ffffff !important; padding: 14px 16px !important; display: flex !important; align-items: center !important; justify-content: space-between !important;">';
    chatHtml += '<div style="display: flex !important; align-items: center !important; gap: 10px !important;">';
    if (!hideAvatar) {
      chatHtml += '<div style="width: 38px !important; height: 38px !important; border-radius: 50% !important; background-color: rgba(255,255,255,0.25) !important; display: flex !important; align-items: center !important; justify-content: center !important; overflow: hidden !important; flex-shrink: 0 !important;">';
      if (avatarUrl) {
        chatHtml += '<img src="' + avatarUrl + '" alt="' + agentName + '" style="width: 100% !important; height: 100% !important; object-fit: cover !important;" />';
      } else {
        chatHtml += '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
      }
      chatHtml += '</div>';
    }
    chatHtml += '<div>';
    chatHtml += '<div style="font-size: 14px !important; font-weight: 800 !important; color: #ffffff !important; line-height: 1.2 !important;">' + agentName + '</div>';
    if (agentRole) {
      chatHtml += '<div style="font-size: 11px !important; color: rgba(255,255,255,0.9) !important; margin-top: 2px !important;">' + agentRole + '</div>';
    }
    chatHtml += '</div></div>';

    chatHtml += '<div id="' + chatBoxId + '-close" style="cursor: pointer !important; font-size: 18px !important; font-weight: bold !important; opacity: 0.8 !important; padding: 4px !important;">✕</div>';
    chatHtml += '</div>';

    // Cuerpo del Mensaje
    chatHtml += '<div style="padding: 16px !important; background-color: #f9fafb !important;">';
    chatHtml += '<div style="background-color: #ffffff !important; border-radius: 12px !important; padding: 12px 14px !important; font-size: 13px !important; color: #111827 !important; line-height: 1.4 !important; border: 1px solid #f3f4f6 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.04) !important;">' + message + '</div>';
    chatHtml += '</div>';

    // Botón de WhatsApp
    var waUrl = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(initialMessage);
    chatHtml += '<div style="padding: 12px 16px 16px 16px !important; background-color: #ffffff !important;">';
    chatHtml += '<a href="' + waUrl + '" target="_blank" rel="noopener noreferrer" style="display: flex !important; align-items: center !important; justify-content: center !important; gap: 8px !important; width: 100% !important; background-color: ' + ctaColor + ' !important; color: #ffffff !important; border-radius: ' + (btnRounded ? '999px' : '8px') + ' !important; padding: 12px !important; font-size: 14px !important; font-weight: 800 !important; text-decoration: none !important; box-sizing: border-box !important; text-align: center !important; box-shadow: 0 4px 12px rgba(37,211,102,0.3) !important;">';
    chatHtml += '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.38 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.38 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>';
    chatHtml += '<span>' + buttonText + '</span>';
    chatHtml += '</a></div>';

    chatHtml += '</div>';

    container.innerHTML = html + chatHtml;
    document.body.appendChild(container);

    var btnEl = document.getElementById(uniqueId + "-btn");
    var chatBoxEl = document.getElementById(chatBoxId);
    var closeXEl = document.getElementById(chatBoxId + "-close");

    var isOpen = false;

    var toggleChat = function() {
      isOpen = !isOpen;
      if (chatBoxEl) {
        chatBoxEl.style.display = isOpen ? "block" : "none";
      }
    };

    if (btnEl) {
      btnEl.addEventListener("click", function(e) {
        e.stopPropagation();
        toggleChat();
      });
    }

    if (closeXEl) {
      closeXEl.addEventListener("click", function(e) {
        e.stopPropagation();
        isOpen = false;
        if (chatBoxEl) chatBoxEl.style.display = "none";
      });
    }

    // Auto popup
    if (showPopupAuto) {
      var storageKey = "nvx_wa_shown_" + w.id;
      var alreadyShown = popupFrequency === "once" && window.sessionStorage && window.sessionStorage.getItem(storageKey);

      if (!alreadyShown) {
        setTimeout(function() {
          if (!isOpen && chatBoxEl) {
            isOpen = true;
            chatBoxEl.style.display = "block";
            if (popupFrequency === "once" && window.sessionStorage) {
              try { window.sessionStorage.setItem(storageKey, "1"); } catch(e){}
            }
          }
        }, popupDelay);
      }
    }

  } catch (err) {
    if (window.console && window.console.warn) {
      window.console.warn("[Nevux] renderBotonWhatsapp error:", err);
    }
  }
        }
/* ═══════════════════════════════════════════
   WIDGET #40: RASPÁ Y GANÁ (v376 - sin burbuja + scratch sin scroll)
   ═══════════════════════════════════════════ */
function renderRaspaGana(w) {
  try {
    var elementId = "nvx-raspa-" + w.id;
    if (document.getElementById(elementId)) return;

    var cfg = w.config || {};
    var freq = cfg.frequency || "once-visit";
    var storageKey = "nvx_raspa_seen_" + w.id;

    // Si ya se mostró / reclamó → no renderizar NADA (ni popup ni burbuja)
    try {
      if (freq === "once-visit" && window.sessionStorage && window.sessionStorage.getItem(storageKey)) {
        return;
      }
      if (freq === "once-day" && window.localStorage) {
        var lastSeen = window.localStorage.getItem(storageKey);
        if (lastSeen && (new Date().getTime() - parseInt(lastSeen, 10) < 86400000)) {
          return;
        }
      }
      if (freq === "once_per_visitor" && window.localStorage && window.localStorage.getItem(storageKey)) {
        return;
      }
      if (freq === "once_per_session" && window.sessionStorage && window.sessionStorage.getItem(storageKey)) {
        return;
      }
      // Flag de "premio reclamado" siempre gana: nunca más se muestra
      if (window.localStorage && window.localStorage.getItem(storageKey + "_done")) {
        return;
      }
    } catch (eFreq) {}

    var title = cfg.title || "Raspá y ganá";
    var subtitle = cfg.subtitle || "Rascá abajo para ver tu premio";
    var scratchText = cfg.scratchText || "RASPÁ Y GANÁ";
    var btnText = cfg.btnText || "Reclamar premio";
    var legalText = cfg.legalText || "";
    var headerImg = cfg.headerImg || "";
    var trigger = cfg.trigger || "enter";
    var collectEmail = cfg.collectEmail !== false;
    var storeId = w.store_id || "";

    var coupons = Array.isArray(cfg.coupons) && cfg.coupons.length > 0 ? cfg.coupons : [
      { id: "c1", title: "20% OFF", code: "GANADOR20", prob: 100 }
    ];

    var bgColor = cfg.bgColor || "#111827";
    var titleColor = cfg.titleColor || "#10B981";
    var textColor = cfg.textColor || "#F3F4F6";
    var btnBg = cfg.btnBg || "#10B981";
    var btnTextCol = cfg.btnTextCol || "#ffffff";
    var scratchBg = cfg.scratchBg || "#F59E0B";
    var titleSize = cfg.titleSize || 24;
    var subtitleSize = cfg.subtitleSize || 14;

    if (cfg.campaignTheme && cfg.campaignTheme !== "none") {
      if (cfg.campaignTheme === "black-friday") {
        bgColor = "#111827"; titleColor = "#F59E0B"; textColor = "#ffffff"; btnBg = "#F59E0B"; btnTextCol = "#111827";
      } else if (cfg.campaignTheme === "hot-sale") {
        bgColor = "#0F172A"; titleColor = "#EF4444"; textColor = "#ffffff"; btnBg = "#EF4444"; btnTextCol = "#ffffff";
      } else if (cfg.campaignTheme === "cyber-monday") {
        bgColor = "#090D16"; titleColor = "#3B82F6"; textColor = "#ffffff"; btnBg = "#3B82F6"; btnTextCol = "#ffffff";
      } else if (cfg.campaignTheme === "navidad") {
        bgColor = "#064E3B"; titleColor = "#ffffff"; textColor = "#ffffff"; btnBg = "#EF4444"; btnTextCol = "#ffffff";
      } else if (cfg.campaignTheme === "san-valentin") {
        bgColor = "#831843"; titleColor = "#ffffff"; textColor = "#ffffff"; btnBg = "#F43F5E"; btnTextCol = "#ffffff";
      } else if (cfg.campaignTheme === "dia-padre-madre") {
        bgColor = "#312E81"; titleColor = "#ffffff"; textColor = "#ffffff"; btnBg = "#10B981"; btnTextCol = "#ffffff";
      } else if (cfg.campaignTheme === "liquidacion") {
        bgColor = "#7F1D1D"; titleColor = "#ffffff"; textColor = "#ffffff"; btnBg = "#FBBF24"; btnTextCol = "#111827";
      }
    }

    var rand = Math.floor(Math.random() * 100) + 1;
    var cum = 0;
    var winner = coupons[0];
    for (var ci = 0; ci < coupons.length; ci++) {
      cum += (parseInt(coupons[ci].prob, 10) || 0);
      if (rand <= cum) {
        winner = coupons[ci];
        break;
      }
    }

    var winnerTitle = winner.title || "Premio";
    var winnerCode = winner.code || "PREMIO";

    function markAsSeen() {
      try {
        if (freq === "once-visit" || freq === "once_per_session") {
          if (window.sessionStorage) window.sessionStorage.setItem(storageKey, "1");
        } else if (freq === "once-day") {
          if (window.localStorage) window.localStorage.setItem(storageKey, String(new Date().getTime()));
        } else if (freq === "once_per_visitor") {
          if (window.localStorage) window.localStorage.setItem(storageKey, "1");
        } else {
          // always u otros: igual marcamos para no reaparecer si ya reclamó
          if (window.sessionStorage) window.sessionStorage.setItem(storageKey, "1");
        }
      } catch (eMark) {}
    }

    function markAsDone() {
      try {
        if (window.localStorage) window.localStorage.setItem(storageKey + "_done", "1");
        if (window.sessionStorage) window.sessionStorage.setItem(storageKey, "1");
      } catch (eDone) {}
    }

    function lockBodyScroll() {
      try {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
        document.body.setAttribute("data-nvx-raspa-lock", "1");
      } catch (eLock) {}
    }

    function unlockBodyScroll() {
      try {
        if (document.body.getAttribute("data-nvx-raspa-lock") === "1") {
          document.documentElement.style.overflow = "";
          document.body.style.overflow = "";
          document.body.style.touchAction = "";
          document.body.removeAttribute("data-nvx-raspa-lock");
        }
      } catch (eUnlock) {}
    }

    function esc(str) {
      if (typeof escapeHtml === "function") return escapeHtml(String(str || ""));
      return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    var styleId = "style-" + elementId;
    if (!document.getElementById(styleId)) {
      var styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.type = "text/css";
      var css =
        "#" + elementId + " {" +
          "position: fixed !important;" +
          "top: 0 !important; left: 0 !important;" +
          "width: 100vw !important; height: 100vh !important;" +
          "background: rgba(0,0,0,0.75) !important;" +
          "backdrop-filter: blur(5px) !important;" +
          "-webkit-backdrop-filter: blur(5px) !important;" +
          "z-index: 9999999 !important;" +
          "display: none !important;" +
          "align-items: center !important;" +
          "justify-content: center !important;" +
          "padding: 16px !important;" +
          "box-sizing: border-box !important;" +
          "font-family: system-ui, -apple-system, sans-serif !important;" +
          "touch-action: none !important;" +
          "overscroll-behavior: none !important;" +
        "}" +
        "#" + elementId + ".nvx-raspa-open {" +
          "display: flex !important;" +
        "}" +
        "#" + elementId + " .nvx-raspa-card {" +
          "background: " + bgColor + " !important;" +
          "color: " + textColor + " !important;" +
          "border-radius: 20px !important;" +
          "padding: 22px 18px !important;" +
          "max-width: 380px !important;" +
          "width: 100% !important;" +
          "text-align: center !important;" +
          "position: relative !important;" +
          "box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4) !important;" +
          "box-sizing: border-box !important;" +
          "animation: nvxRaspaPopIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;" +
          "touch-action: none !important;" +
        "}" +
        "@keyframes nvxRaspaPopIn { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }" +
        "#" + elementId + " .nvx-raspa-close {" +
          "position: absolute !important; top: 12px !important; right: 14px !important;" +
          "font-size: 18px !important; cursor: pointer !important; opacity: 0.6 !important;" +
          "font-weight: 800 !important; border: none !important; background: none !important;" +
          "color: " + textColor + " !important; line-height: 1 !important;" +
        "}" +
        "#" + elementId + " .nvx-raspa-close:hover { opacity: 1 !important; }" +
        "#" + elementId + " .nvx-raspa-input {" +
          "width: 100% !important; padding: 12px 14px !important; font-size: 14px !important;" +
          "border: 1.5px solid #e5e7eb !important; border-radius: 12px !important;" +
          "margin-bottom: 10px !important; box-sizing: border-box !important;" +
          "text-align: center !important; outline: none !important; color: #111827 !important;" +
          "background: #ffffff !important;" +
        "}" +
        "#" + elementId + " .nvx-raspa-btn {" +
          "width: 100% !important; background: " + btnBg + " !important; color: " + btnTextCol + " !important;" +
          "border: none !important; border-radius: 12px !important; padding: 14px !important;" +
          "font-size: 15px !important; font-weight: 800 !important; cursor: pointer !important;" +
          "box-shadow: 0 4px 14px rgba(0,0,0,0.15) !important;" +
        "}" +
        "#" + elementId + " .nvx-raspa-coupon {" +
          "background: rgba(16,185,129,0.08) !important; border: 2px dashed " + btnBg + " !important;" +
          "border-radius: 14px !important; padding: 14px !important; margin: 10px 0 !important;" +
        "}" +
        "#" + elementId + " canvas {" +
          "touch-action: none !important;" +
          "-ms-touch-action: none !important;" +
          "user-select: none !important;" +
          "-webkit-user-select: none !important;" +
        "}";
      styleEl.appendChild(document.createTextNode(css));
      document.head.appendChild(styleEl);
    }

    window["nvxCloseRaspa_" + w.id] = function () {
      markAsSeen();
      unlockBodyScroll();
      var el = document.getElementById(elementId);
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };

    window["nvxOpenRaspa_" + w.id] = function () {
      var el = document.getElementById(elementId);
      if (!el) return;
      if (el.className.indexOf("nvx-raspa-open") === -1) {
        el.className = (el.className ? el.className + " " : "") + "nvx-raspa-open";
      }
      lockBodyScroll();
      markAsSeen();
    };

    window["nvxClaimRaspa_" + w.id] = function () {
      var emailInput = document.getElementById(elementId + "-email");
      var email = emailInput ? String(emailInput.value || "").trim() : "";
      if (!email || email.indexOf("@") === -1) {
        if (emailInput) {
          emailInput.style.borderColor = "#ef4444";
          emailInput.focus();
        }
        return;
      }

      try {
        fetch("https://nevux.ar/api/social-proof", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            store_id: storeId,
            type: "raspa_lead",
            email: email,
            coupon: winnerCode,
            prize: winnerTitle
          })
        }).catch(function () {});
      } catch (eSend) {}

      var emailStep = document.getElementById(elementId + "-email-step");
      var copyStep = document.getElementById(elementId + "-copy-step");
      if (emailStep) emailStep.style.display = "none";
      if (copyStep) copyStep.style.display = "block";
      markAsDone();
    };

    window["nvxCopyRaspa_" + w.id] = function (btn) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(winnerCode);
        }
      } catch (eCopy) {}
      markAsDone();
      if (btn) {
        var prev = btn.innerHTML;
        btn.innerHTML = "¡Copiado al portapapeles! ✓";
        setTimeout(function () {
          btn.innerHTML = prev;
          window["nvxCloseRaspa_" + w.id]();
        }, 1200);
      } else {
        window["nvxCloseRaspa_" + w.id]();
      }
    };

    var popupOverlay = document.createElement("div");
    popupOverlay.id = elementId;
    popupOverlay.setAttribute("data-nevux-widget", "raspa-gana");

    var headerHtml = "";
    if (headerImg) {
      headerHtml = '<img src="' + esc(headerImg) + '" alt="" style="max-width:100% !important;max-height:90px !important;object-fit:contain !important;margin-bottom:12px !important;border-radius:8px !important;" />';
    }

    var legalHtml = legalText
      ? '<div style="font-size:10px !important;opacity:0.6 !important;margin-top:12px !important;line-height:1.3 !important;">' + esc(legalText) + '</div>'
      : "";

    var emailBlock = "";
    if (collectEmail) {
      emailBlock =
        '<div id="' + elementId + '-email-step" style="display:none !important;">' +
          '<div style="font-size:12px !important;font-weight:700 !important;margin-bottom:8px !important;">¡Felicidades! Ingresá tu email para desbloquear el cupón:</div>' +
          '<input type="email" id="' + elementId + '-email" class="nvx-raspa-input" placeholder="Tu correo electrónico..." />' +
          '<button type="button" class="nvx-raspa-btn" onclick="window[\'nvxClaimRaspa_' + w.id + '\']();">' + esc(btnText) + '</button>' +
        '</div>' +
        '<div id="' + elementId + '-copy-step" style="display:none !important;">' +
          '<div class="nvx-raspa-coupon">' +
            '<div style="font-size:11px !important;opacity:0.7 !important;margin-bottom:4px !important;">Tu cupón</div>' +
            '<div style="font-size:22px !important;font-weight:900 !important;letter-spacing:1px !important;color:' + btnBg + ' !important;font-family:monospace !important;">' + esc(winnerCode) + '</div>' +
            '<div style="font-size:12px !important;font-weight:700 !important;margin-top:6px !important;">' + esc(winnerTitle) + '</div>' +
          '</div>' +
          '<button type="button" class="nvx-raspa-btn" onclick="window[\'nvxCopyRaspa_' + w.id + '\'](this);">📋 Copiar Código y Usar</button>' +
        '</div>' +
        '<div id="' + elementId + '-hint" style="font-size:12px !important;opacity:0.85 !important;">✨ ¡Rascá con tu dedo o mouse la tarjeta arriba!</div>';
    } else {
      emailBlock =
        '<div id="' + elementId + '-copy-step" style="display:none !important;">' +
          '<div class="nvx-raspa-coupon">' +
            '<div style="font-size:11px !important;opacity:0.7 !important;margin-bottom:4px !important;">Tu cupón</div>' +
            '<div style="font-size:22px !important;font-weight:900 !important;letter-spacing:1px !important;color:' + btnBg + ' !important;font-family:monospace !important;">' + esc(winnerCode) + '</div>' +
            '<div style="font-size:12px !important;font-weight:700 !important;margin-top:6px !important;">' + esc(winnerTitle) + '</div>' +
          '</div>' +
          '<button type="button" class="nvx-raspa-btn" onclick="window[\'nvxCopyRaspa_' + w.id + '\'](this);">📋 Copiar Código y Usar</button>' +
        '</div>' +
        '<div id="' + elementId + '-hint" style="font-size:12px !important;opacity:0.85 !important;">✨ ¡Rascá con tu dedo o mouse la tarjeta arriba!</div>';
    }

    popupOverlay.innerHTML =
      '<div class="nvx-raspa-card">' +
        '<button type="button" class="nvx-raspa-close" onclick="window[\'nvxCloseRaspa_' + w.id + '\']();">✕</button>' +
        headerHtml +
        '<div style="font-size:' + titleSize + 'px !important;font-weight:900 !important;color:' + titleColor + ' !important;margin-bottom:6px !important;line-height:1.2 !important;">' + esc(title) + '</div>' +
        '<div style="font-size:' + subtitleSize + 'px !important;opacity:0.9 !important;margin-bottom:14px !important;line-height:1.35 !important;">' + esc(subtitle) + '</div>' +
        '<div id="' + elementId + '-scratch-wrap" style="position:relative !important;width:280px !important;height:130px !important;margin:0 auto 16px auto !important;border-radius:12px !important;overflow:hidden !important;box-shadow:0 4px 12px rgba(0,0,0,0.2) !important;touch-action:none !important;">' +
          '<div style="position:absolute !important;top:0 !important;left:0 !important;width:100% !important;height:100% !important;background:#ffffff !important;color:#111827 !important;display:flex !important;flex-direction:column !important;align-items:center !important;justify-content:center !important;padding:10px !important;box-sizing:border-box !important;border:2px dashed ' + btnBg + ' !important;border-radius:12px !important;">' +
            '<div style="font-size:18px !important;font-weight:900 !important;color:#10B981 !important;margin-bottom:4px !important;">' + esc(winnerTitle) + '</div>' +
            '<div style="font-size:11px !important;color:#6B7280 !important;">CÓDIGO DE CUPÓN</div>' +
            '<div style="font-size:16px !important;font-weight:900 !important;letter-spacing:1px !important;color:#111827 !important;background:#F3F4F6 !important;padding:4px 12px !important;border-radius:6px !important;margin-top:2px !important;font-family:monospace !important;">' + esc(winnerCode) + '</div>' +
          '</div>' +
          '<canvas id="' + elementId + '-canvas" width="280" height="130" style="position:absolute !important;top:0 !important;left:0 !important;width:280px !important;height:130px !important;cursor:pointer !important;border-radius:12px !important;z-index:2 !important;touch-action:none !important;"></canvas>' +
        '</div>' +
        emailBlock +
        legalHtml +
      '</div>';

    document.body.appendChild(popupOverlay);

    // Canvas raspadita SIN scroll
    var canvas = document.getElementById(elementId + "-canvas");
    if (canvas) {
      var ctx = canvas.getContext("2d");
      var isScratching = false;
      var scratchedCount = 0;
      var isRevealed = false;

      ctx.fillStyle = scratchBg;
      ctx.fillRect(0, 0, 280, 130);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(scratchText, 140, 70);

      var scratchAt = function (x, y) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fill();
        scratchedCount++;

        if (scratchedCount > 25 && !isRevealed) {
          isRevealed = true;
          canvas.style.transition = "opacity 0.4s ease";
          canvas.style.opacity = "0";
          setTimeout(function () {
            canvas.style.display = "none";
            var hint = document.getElementById(elementId + "-hint");
            if (hint) hint.style.display = "none";

            if (collectEmail) {
              var emailStep = document.getElementById(elementId + "-email-step");
              if (emailStep) emailStep.style.display = "block";
            } else {
              var copyStep = document.getElementById(elementId + "-copy-step");
              if (copyStep) copyStep.style.display = "block";
              markAsDone();
            }
          }, 400);
        }
      };

      var getCoords = function (e) {
        var rect = canvas.getBoundingClientRect();
        var clientX = e.touches ? e.touches[0].clientX : e.clientX;
        var clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: clientX - rect.left,
          y: clientY - rect.top
        };
      };

      // Mouse
      canvas.addEventListener("mousedown", function (e) {
        e.preventDefault();
        isScratching = true;
        var c = getCoords(e);
        scratchAt(c.x, c.y);
      });
      canvas.addEventListener("mousemove", function (e) {
        if (!isScratching) return;
        e.preventDefault();
        var c = getCoords(e);
        scratchAt(c.x, c.y);
      });
      window.addEventListener("mouseup", function () { isScratching = false; });

      // Touch: passive:false + preventDefault = NO scroll de fondo
      canvas.addEventListener("touchstart", function (e) {
        if (e.cancelable) e.preventDefault();
        isScratching = true;
        var c = getCoords(e);
        scratchAt(c.x, c.y);
      }, { passive: false });

      canvas.addEventListener("touchmove", function (e) {
        if (e.cancelable) e.preventDefault();
        if (!isScratching) return;
        var c = getCoords(e);
        scratchAt(c.x, c.y);
      }, { passive: false });

      canvas.addEventListener("touchend", function (e) {
        if (e.cancelable) e.preventDefault();
        isScratching = false;
      }, { passive: false });

      // Evitar scroll también sobre el wrapper
      var wrap = document.getElementById(elementId + "-scratch-wrap");
      if (wrap) {
        wrap.addEventListener("touchstart", function (e) {
          if (e.cancelable) e.preventDefault();
        }, { passive: false });
        wrap.addEventListener("touchmove", function (e) {
          if (e.cancelable) e.preventDefault();
        }, { passive: false });
      }
    }

    // Bloquear scroll del overlay mientras está abierto
    popupOverlay.addEventListener("touchmove", function (e) {
      // Permitir scroll solo dentro de inputs si hiciera falta; el resto se bloquea
      var tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : "";
      if (tag !== "input" && tag !== "textarea") {
        if (e.cancelable) e.preventDefault();
      }
    }, { passive: false });

    var openPopup = function () {
      // Re-check por si en otra pestaña ya lo reclamó
      try {
        if (window.localStorage && window.localStorage.getItem(storageKey + "_done")) return;
      } catch (eRecheck) {}
      window["nvxOpenRaspa_" + w.id]();
      if (typeof nvxTrack === "function") {
        nvxTrack(w.id, "impression");
      }
    };

    if (trigger === "enter") {
      setTimeout(openPopup, 600);
    } else if (trigger === "delay-5") {
      setTimeout(openPopup, 5000);
    } else if (trigger === "delay-10") {
      setTimeout(openPopup, 10000);
    } else if (trigger === "scroll-50") {
      var onScroll = function () {
        var denom = document.documentElement.scrollHeight - window.innerHeight;
        var scrolled = denom > 0 ? (window.scrollY / denom) : 0;
        if (scrolled >= 0.5) {
          openPopup();
          window.removeEventListener("scroll", onScroll);
        }
      };
      window.addEventListener("scroll", onScroll);
    } else if (trigger === "exit-intent") {
      var onExit = function (e) {
        if (e.clientY <= 10) {
          openPopup();
          document.removeEventListener("mouseleave", onExit);
        }
      };
      document.addEventListener("mouseleave", onExit);
    } else {
      setTimeout(openPopup, 600);
    }

    // ❌ SIN burbuja flotante: el widget es one-shot (popup → raspa → reclama → listo)

  } catch (err) {
    if (window.console && window.console.warn) {
      window.console.warn("[Nevux] renderRaspaGana error:", err);
    }
  }
       }
    /* ═══════════════════════════════════════════
   WIDGET: POP-UP PROMOCIONAL (v377)
   ═══════════════════════════════════════════ */
function renderPopupPromocional(w) {
  var elementId = "nvx-popup-" + w.id;
  if (document.getElementById(elementId + "-overlay")) return;

  var cfg = w.config || {};
  var currentPage = typeof detectPageType === "function" ? detectPageType() : "";

  // 1. Segmentación (Targeting)
  var targetType = w.target_type || cfg.target_type || "all";
  if (targetType === "product" && currentPage !== "product") return;
  if (targetType === "category" && currentPage !== "category") return;

  if (targetType === "product" && w.product_id) {
    if (typeof LS !== "undefined" && LS.product && String(LS.product.id) !== String(w.product_id)) return;
  }
  if (targetType === "category" && w.category_id) {
    if (typeof LS !== "undefined" && LS.category && String(LS.category.id) !== String(w.category_id)) return;
  }

  // 2. Control de Frecuencia
  var storageKey = "nvx_popup_seen_" + w.id;
  var now = new Date().getTime();
  var freq = cfg.frequency || "once-visit";

  if (freq === "once-visit") {
    try { if (sessionStorage.getItem(storageKey)) return; } catch (e) {}
  } else if (freq === "once-day") {
    try {
      var lastSeen = localStorage.getItem(storageKey);
      if (lastSeen && (now - parseInt(lastSeen, 10)) < 86400000) return;
    } catch (e) {}
  }

  // 3. Fechas Especiales y Temas Visuales
  var bgColor = cfg.bg_color || "#ffffff";
  var textColor = cfg.text_color || "#111827";
  var btnBgColor = cfg.btn_bg_color || "#10B981";
  var btnTextColor = cfg.btn_text_color || "#ffffff";
  var accentColor = cfg.btn_bg_color || "#10B981";

  var THEMES = {
    "black-friday": { bg: "#0F172A", text: "#FFFFFF", btnBg: "#F59E0B", btnText: "#000000", accent: "#F59E0B" },
    "hot-sale": { bg: "#FFFFFF", text: "#0F172A", btnBg: "#EF4444", btnText: "#FFFFFF", accent: "#EF4444" },
    "cyber-monday": { bg: "#090D16", text: "#FFFFFF", btnBg: "#3B82F6", btnText: "#FFFFFF", accent: "#3B82F6" },
    "navidad": { bg: "#064E3B", text: "#FFFFFF", btnBg: "#EF4444", btnText: "#FFFFFF", accent: "#F59E0B" },
    "san-valentin": { bg: "#FFF1F2", text: "#831843", btnBg: "#F43F5E", btnText: "#FFFFFF", accent: "#F43F5E" },
    "dia-padre-madre": { bg: "#F0FDF4", text: "#166534", btnBg: "#10B981", btnText: "#FFFFFF", accent: "#10B981" },
    "liquidacion": { bg: "#FEF2F2", text: "#991B1B", btnBg: "#DC2626", btnText: "#FFFFFF", accent: "#F59E0B" }
  };

  var themeKey = cfg.campaignTheme || cfg.fechas_especiales;
  if (themeKey && themeKey !== "none" && THEMES[themeKey]) {
    var t = THEMES[themeKey];
    bgColor = t.bg;
    textColor = t.text;
    btnBgColor = t.btnBg;
    btnTextColor = t.btnText;
    accentColor = t.accent;
  }

  // 4. Inyección de Estilos
  var styleId = "style-" + elementId;
  if (!document.getElementById(styleId)) {
    var styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.type = "text/css";
    var cssText =
      "#" + elementId + "-overlay { " +
        "position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; " +
        "background: rgba(0,0,0,0.65) !important; backdrop-filter: blur(4px) !important; display: flex !important; " +
        "align-items: center !important; justify-content: center !important; z-index: 999999 !important; " +
        "opacity: 0 !important; visibility: hidden !important; transition: opacity 0.3s ease, visibility 0.3s ease !important; " +
        "padding: 16px !important; box-sizing: border-box !important; " +
      "} " +
      "#" + elementId + "-overlay.nvx-active { " +
        "opacity: 1 !important; visibility: visible !important; " +
      "} " +
      "#" + elementId + "-modal { " +
        "background: " + bgColor + " !important; color: " + textColor + " !important; " +
        "width: 100% !important; max-width: 480px !important; border-radius: " + (cfg.border_radius || "16") + "px !important; " +
        "overflow: hidden !important; position: relative !important; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35) !important; " +
        "transform: scale(0.9) translateY(10px) !important; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important; " +
        "font-family: system-ui, -apple-system, sans-serif !important; " +
      "} " +
      "#" + elementId + "-overlay.nvx-active #" + elementId + "-modal { " +
        "transform: scale(1) translateY(0) !important; " +
      "} " +
      "#" + elementId + "-close { " +
        "position: absolute !important; top: 12px !important; right: 12px !important; width: 32px !important; height: 32px !important; " +
        "border-radius: 50% !important; background: rgba(0,0,0,0.25) !important; color: #ffffff !important; " +
        "border: none !important; cursor: pointer !important; display: flex !important; align-items: center !important; " +
        "justify-content: center !important; font-size: 16px !important; font-weight: bold !important; z-index: 10 !important; " +
        "line-height: 1 !important; transition: background 0.2s !important; " +
      "} " +
      "#" + elementId + "-close:hover { background: rgba(0,0,0,0.45) !important; } " +
      "#" + elementId + "-reopen { " +
        "position: fixed !important; bottom: 20px !important; left: 20px !important; " +
        "background: " + btnBgColor + " !important; color: " + btnTextColor + " !important; " +
        "padding: 10px 18px !important; border-radius: 999px !important; cursor: pointer !important; " +
        "z-index: 999998 !important; box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important; " +
        "font-weight: 800 !important; font-size: 13px !important; display: none !important; align-items: center !important; gap: 8px !important; " +
        "font-family: system-ui, -apple-system, sans-serif !important; border: 2px solid #ffffff !important; " +
      "}";

    styleEl.appendChild(document.createTextNode(cssText));
    document.head.appendChild(styleEl);
  }

  // 5. Estructura HTML del Pop-up
  var safeTitle = typeof escapeHtml === "function" ? escapeHtml(cfg.title || "¡Oferta especial!") : (cfg.title || "¡Oferta especial!");
  var safeSubtitle = typeof escapeHtml === "function" ? escapeHtml(cfg.subtitle || "") : (cfg.subtitle || "");
  var safeBody = typeof escapeHtml === "function" ? escapeHtml(cfg.body_text || "") : (cfg.body_text || "");
  var safeLegal = typeof escapeHtml === "function" ? escapeHtml(cfg.legal_text || "") : (cfg.legal_text || "");
  var safeBtnText = typeof escapeHtml === "function" ? escapeHtml(cfg.btn_text || "¡Quiero aprovechar!") : (cfg.btn_text || "¡Quiero aprovechar!");

  var overlay = document.createElement("div");
  overlay.id = elementId + "-overlay";

  var html = '<div id="' + elementId + '-modal">';
  html += '<button id="' + elementId + '-close">✕</button>';

  if (cfg.header_image) {
    html += '<img src="' + cfg.header_image + '" style="width:100% !important;height:180px !important;object-fit:cover !important;display:block !important;" />';
  }

  html += '<div style="padding:24px !important;text-align:center !important;">';

  if (safeTitle) {
    html += '<div style="font-size:' + (cfg.title_size || "22") + 'px !important;font-weight:800 !important;margin-bottom:6px !important;line-height:1.2 !important;color:' + textColor + ' !important;">' + safeTitle + '</div>';
  }

  if (safeSubtitle) {
    html += '<div style="font-size:14px !important;opacity:0.85 !important;margin-bottom:16px !important;color:' + textColor + ' !important;">' + safeSubtitle + '</div>';
  }

  if (safeBody) {
    html += '<div style="font-size:13px !important;line-height:1.5 !important;margin-bottom:18px !important;opacity:0.9 !important;color:' + textColor + ' !important;">' + safeBody + '</div>';
  }

  if (cfg.show_countdown && cfg.countdown_date) {
    html += '<div id="' + elementId + '-cd" style="display:flex !important;justify-content:center !important;gap:8px !important;margin-bottom:20px !important;">' +
      '<div style="background:rgba(0,0,0,0.06) !important;padding:6px 10px !important;border-radius:8px !important;min-width:44px !important;"><span id="' + elementId + '-d" style="font-size:16px !important;font-weight:900 !important;display:block !important;color:' + accentColor + ' !important;">00</span><span style="font-size:9px !important;text-transform:uppercase !important;opacity:0.7 !important;font-weight:700 !important;">Días</span></div>' +
      '<div style="background:rgba(0,0,0,0.06) !important;padding:6px 10px !important;border-radius:8px !important;min-width:44px !important;"><span id="' + elementId + '-h" style="font-size:16px !important;font-weight:900 !important;display:block !important;color:' + accentColor + ' !important;">00</span><span style="font-size:9px !important;text-transform:uppercase !important;opacity:0.7 !important;font-weight:700 !important;">Hs</span></div>' +
      '<div style="background:rgba(0,0,0,0.06) !important;padding:6px 10px !important;border-radius:8px !important;min-width:44px !important;"><span id="' + elementId + '-m" style="font-size:16px !important;font-weight:900 !important;display:block !important;color:' + accentColor + ' !important;">00</span><span style="font-size:9px !important;text-transform:uppercase !important;opacity:0.7 !important;font-weight:700 !important;">Min</span></div>' +
      '<div style="background:rgba(0,0,0,0.06) !important;padding:6px 10px !important;border-radius:8px !important;min-width:44px !important;"><span id="' + elementId + '-s" style="font-size:16px !important;font-weight:900 !important;display:block !important;color:' + accentColor + ' !important;">00</span><span style="font-size:9px !important;text-transform:uppercase !important;opacity:0.7 !important;font-weight:700 !important;">Seg</span></div>' +
    '</div>';
  }

  if (cfg.collect_email) {
    html += '<input type="email" id="' + elementId + '-email" placeholder="Ingresá tu email aquí..." style="width:100% !important;padding:12px 14px !important;border:1px solid rgba(0,0,0,0.15) !important;border-radius:8px !important;margin-bottom:12px !important;box-sizing:border-box !important;font-size:14px !important;outline:none !important;" />';
  }

  html += '<button id="' + elementId + '-btn" style="width:100% !important;padding:14px !important;border:none !important;border-radius:8px !important;background:' + btnBgColor + ' !important;color:' + btnTextColor + ' !important;font-size:15px !important;font-weight:800 !important;cursor:pointer !important;box-shadow:0 4px 12px rgba(0,0,0,0.12) !important;">' + safeBtnText + '</button>';

  if (safeLegal) {
    html += '<div style="font-size:10px !important;opacity:0.6 !important;margin-top:12px !important;">' + safeLegal + '</div>';
  }

  html += '</div></div>';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);

  // 6. Botón Flotante Reapertura
  var reopenBtn = null;
  if (cfg.show_reopen_btn) {
    reopenBtn = document.createElement("div");
    reopenBtn.id = elementId + "-reopen";
    reopenBtn.innerHTML = '🎁 <span style="font-weight:800 !important;">Oferta Especial</span>';
    document.body.appendChild(reopenBtn);
  }

  // 7. Lógica Visibilidad
  function markAsSeen() {
    try {
      if (freq === "once-visit") {
        sessionStorage.setItem(storageKey, "1");
      } else if (freq === "once-day") {
        localStorage.setItem(storageKey, new Date().getTime().toString());
      }
    } catch (e) {}
  }

  function triggerShow() {
    overlay.classList.add("nvx-active");
    if (reopenBtn) reopenBtn.style.display = "none";
    markAsSeen();

    if (typeof nvxTrack === "function") {
      nvxTrack(w.id, "impression");
    }
  }

  function triggerClose() {
    overlay.classList.remove("nvx-active");
    if (cfg.show_reopen_btn && reopenBtn) {
      reopenBtn.style.display = "flex";
    }
  }

  document.getElementById(elementId + "-close").addEventListener("click", triggerClose);
  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) triggerClose();
  });

  if (reopenBtn) {
    reopenBtn.addEventListener("click", triggerShow);
  }

  document.getElementById(elementId + "-btn").addEventListener("click", function() {
    var btnEl = this;
    var emailInput = document.getElementById(elementId + "-email");
    var emailVal = emailInput ? emailInput.value.trim() : "";

    if (cfg.collect_email && emailInput) {
      if (!emailVal || emailVal.indexOf("@") === -1) {
        emailInput.style.borderColor = "#EF4444";
        return;
      }
    }

    if (typeof nvxTrack === "function") {
      nvxTrack(w.id, cfg.collect_email ? "lead" : "click");
    }

    if (cfg.btn_action_type === "link" && cfg.btn_link) {
      window.open(cfg.btn_link, "_blank");
    }

    if (cfg.collect_email) {
      btnEl.innerText = "¡Gracias!";
      btnEl.style.opacity = "0.8";
      setTimeout(triggerClose, 1200);
    } else {
      triggerClose();
    }
  });

  // 8. Timer Regresivo
  if (cfg.show_countdown && cfg.countdown_date) {
    var targetTime = new Date(cfg.countdown_date).getTime();

    function updateCd() {
      var diff = targetTime - new Date().getTime();
      if (diff <= 0) diff = 0;

      var d = Math.floor(diff / (1000 * 60 * 60 * 24));
      var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var s = Math.floor((diff % (1000 * 60)) / 1000);

      var dEl = document.getElementById(elementId + "-d");
      var hEl = document.getElementById(elementId + "-h");
      var mEl = document.getElementById(elementId + "-m");
      var sEl = document.getElementById(elementId + "-s");

      if (dEl) dEl.innerText = (d < 10 ? "0" : "") + d;
      if (hEl) hEl.innerText = (h < 10 ? "0" : "") + h;
      if (mEl) mEl.innerText = (m < 10 ? "0" : "") + m;
      if (sEl) sEl.innerText = (s < 10 ? "0" : "") + s;
    }

    updateCd();
    setInterval(updateCd, 1000);
  }

  // 9. Modos de Disparo (Triggers)
  var trigger = cfg.trigger || "enter";

  if (trigger === "enter") {
    setTimeout(triggerShow, 600);
  } else if (trigger === "delay-5") {
    setTimeout(triggerShow, 5000);
  } else if (trigger === "delay-10") {
    setTimeout(triggerShow, 10000);
  } else if (trigger === "scroll-50") {
    var onScroll = function() {
      var st = document.documentElement.scrollTop || document.body.scrollTop;
      var sh = document.documentElement.scrollHeight || document.body.scrollHeight;
      var ch = document.documentElement.clientHeight;
      if ((st / (sh - ch)) >= 0.5) {
        triggerShow();
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll);
  } else if (trigger === "exit-intent") {
    var onExit = function(e) {
      if (e.clientY <= 0) {
        triggerShow();
        document.removeEventListener("mouseleave", onExit);
      }
    };
    document.addEventListener("mouseleave", onExit);
  }
          }
/* ═══════════════════════════════════════════
   NOTIFICACIONES FLOTANTES ROTATIVAS (v4 FIX KEYS)
═══════════════════════════════════════════ */
var renderNotificacionesFlotantes = function(w) {
  if (!w) return;
  if (w.is_active === false || w.is_active === "false" || w.is_active === 0) return;
  if (w.user_disabled === true || w.user_disabled === "true") return;

  var cfg = w.config || {};
  if (typeof cfg === "string") {
    try { cfg = JSON.parse(cfg); } catch(e) { cfg = {}; }
  }
  if (cfg.user_disabled === true || cfg.user_disabled === "true") return;

  var notifs = cfg.notifications || [];
  if (typeof notifs === "string") {
    try { notifs = JSON.parse(notifs); } catch(e2) { notifs = []; }
  }
  if (!Array.isArray(notifs) || notifs.length === 0) return;

  var freq = cfg.frequency || "once-visit";
  var storageKey = "nvx_nf_" + (w.id || "def");
  if (freq === "once-visit") {
    try { if (sessionStorage.getItem(storageKey)) return; sessionStorage.setItem(storageKey, "1"); } catch(e3) {}
  } else if (freq === "once-device") {
    try { if (localStorage.getItem(storageKey)) return; localStorage.setItem(storageKey, "1"); } catch(e4) {}
  }

  if (typeof nvxTrack === "function") nvxTrack(w.id, "impression");

  var position = cfg.position || "bottom-right";
  var bgColor = cfg.bgColor || "#ffffff";
  var titleColor = cfg.titleColor || "#111111";
  var subtitleColor = cfg.subtitleColor || "#666666";
  var textColor = cfg.textColor || "#444444";
  var btnBg = cfg.btnBg || "#333333";
  var btnTextColor = cfg.btnTextColor || "#ffffff";
  var borderLeftColor = cfg.borderLeftColor || "";
  var titleSize = cfg.titleSize || 14;
  var subtitleSize = cfg.subtitleSize || 12;
  var textSize = cfg.textSize || 13;
  var btnSize = cfg.btnSize || 12;
  var btnBorderRadius = (typeof cfg.btnBorderRadius === "number") ? cfg.btnBorderRadius : 6;
  var delayFirst = (typeof cfg.delayFirst === "number") ? cfg.delayFirst : 0;
  var intervalSec = (typeof cfg.intervalSec === "number") ? cfg.intervalSec : 5;
  var autoClose = (typeof cfg.autoClose === "number") ? cfg.autoClose : 5;
  var borderRadius = (typeof cfg.borderRadius === "number") ? cfg.borderRadius : 12;
  var padding = (typeof cfg.padding === "number") ? cfg.padding : 16;

  var cId = "nvx-nf-" + (w.id || "root");
  if (document.getElementById(cId)) return;

  var container = document.createElement("div");
  container.id = cId;

  var posCSS = "position:fixed!important;z-index:999999!important;max-width:360px!important;width:90vw!important;pointer-events:none!important;box-sizing:border-box!important;";
  if (position === "top-right") posCSS += "top:20px!important;right:20px!important;";
  else if (position === "top-left") posCSS += "top:20px!important;left:20px!important;";
  else if (position === "bottom-left") posCSS += "bottom:20px!important;left:20px!important;";
  else if (position === "center-left") posCSS += "top:50%!important;left:20px!important;transform:translateY(-50%)!important;";
  else if (position === "center-right") posCSS += "top:50%!important;right:20px!important;transform:translateY(-50%)!important;";
  else posCSS += "bottom:20px!important;right:20px!important;";

  container.style.cssText = posCSS;
  if (!document.body) return;
  document.body.appendChild(container);

  if (!document.getElementById("nvx-nf-kf")) {
    var st = document.createElement("style");
    st.id = "nvx-nf-kf";
    st.textContent = "@keyframes nvxNfIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}";
    document.head.appendChild(st);
  }

  var esc = function(s) {
    if (!s) return "";
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };

  var curIdx = 0;
  var closeTimer = null;
  var rotateTimer = null;

  var showOne = function() {
    if (!container || !container.parentNode) return;
    clearTimeout(closeTimer);
    clearTimeout(rotateTimer);

    var n = notifs[curIdx % notifs.length];
    if (!n) return;

    var bL = borderLeftColor ? "border-left:4px solid " + borderLeftColor + "!important;" : "";

    var h = '<div style="pointer-events:auto!important;background:' + bgColor + '!important;border-radius:' + borderRadius + 'px!important;padding:' + padding + 'px!important;box-shadow:0 8px 30px rgba(0,0,0,0.15)!important;' + bL + 'display:flex!important;gap:12px!important;align-items:flex-start!important;font-family:system-ui,-apple-system,sans-serif!important;animation:nvxNfIn 0.4s ease!important;position:relative!important;box-sizing:border-box!important;width:100%!important;">';

    h += '<div class="nvx-nf-x" style="position:absolute!important;top:8px!important;right:10px!important;cursor:pointer!important;color:' + textColor + '!important;opacity:0.4!important;font-size:16px!important;line-height:1!important;z-index:2!important;">&#10005;</div>';

    if (n.image) {
      h += '<img src="' + n.image + '" alt="" style="width:48px!important;height:48px!important;border-radius:8px!important;object-fit:cover!important;flex-shrink:0!important;display:block!important;" />';
    }

    h += '<div style="flex:1!important;min-width:0!important;padding-right:18px!important;">';

    if (n.title) {
      h += '<div style="font-size:' + titleSize + 'px!important;font-weight:800!important;color:' + titleColor + '!important;line-height:1.3!important;margin-bottom:2px!important;">' + esc(n.title) + '</div>';
    }

    if (n.subtitle) {
      h += '<div style="font-size:' + subtitleSize + 'px!important;color:' + subtitleColor + '!important;margin-bottom:4px!important;font-weight:600!important;">' + esc(n.subtitle) + '</div>';
    }

    if (n.text) {
      h += '<div style="font-size:' + textSize + 'px!important;color:' + textColor + '!important;line-height:1.4!important;margin-bottom:' + (n.btnText ? '10' : '0') + 'px!important;">' + esc(n.text) + '</div>';
    }

    if (n.btnText) {
      h += '<button class="nvx-nf-btn" style="display:inline-block!important;padding:6px 14px!important;background:' + btnBg + '!important;color:' + btnTextColor + '!important;border:none!important;border-radius:' + btnBorderRadius + 'px!important;font-size:' + btnSize + 'px!important;font-weight:700!important;cursor:pointer!important;font-family:inherit!important;">' + esc(n.btnText) + '</button>';
    }

    h += '</div></div>';
    container.innerHTML = h;

    var xBtn = container.querySelector(".nvx-nf-x");
    if (xBtn) {
      xBtn.onclick = function() {
        clearTimeout(closeTimer);
        clearTimeout(rotateTimer);
        if (container.parentNode) container.parentNode.removeChild(container);
      };
    }

    var bBtn = container.querySelector(".nvx-nf-btn");
    if (bBtn && n.btnUrl) {
      bBtn.onclick = function() { window.open(n.btnUrl, "_blank"); };
    }

    if (autoClose > 0) {
      closeTimer = setTimeout(function() {
        if (notifs.length > 1) {
          curIdx = (curIdx + 1) % notifs.length;
          showOne();
        } else {
          if (container.parentNode) container.parentNode.removeChild(container);
        }
      }, autoClose * 1000);
    } else if (notifs.length > 1) {
      rotateTimer = setTimeout(function() {
        curIdx = (curIdx + 1) % notifs.length;
        showOne();
      }, intervalSec * 1000);
    }
  };

  if (delayFirst > 0) {
    setTimeout(showOne, delayFirst * 1000);
  } else {
    showOne();
  }
};
      /* ═══════════════════════════════════════════
   WIDGET: ALERTA DE INVENTARIO
   ═══════════════════════════════════════════ */
function renderAlertaInventario(w) {
  var elementId = "nvx-alerta-inventario-" + w.id;
  if (document.getElementById(elementId)) return;

  var cfg = w.config || {};

  // Solo se muestra en la Ficha de Producto
  var currentPage = typeof detectPageType === "function" ? detectPageType() : "";
  if (currentPage !== "product") {
    return;
  }

  var threshold = parseInt(cfg.threshold, 10);
  if (isNaN(threshold) || threshold <= 0) threshold = 10;

  var messageText = cfg.messageText || "🔥 ¡Apurate! Quedan solo **{cantidad}** unidades disponibles";
  var enableLastUnitMsg = cfg.enableLastUnitMsg === true;
  var lastUnitText = cfg.lastUnitText || "🚨 ¡Última unidad disponible! No te la pierdas";

  var position = cfg.position || "above-cart";
  var iconType = cfg.iconType || "emoji";
  var customEmoji = cfg.customEmoji || "🔥";
  var iconImageUrl = cfg.iconImageUrl || "";

  var bgColor = cfg.bgColor || "#FFF5F5";
  var textColor = cfg.textColor || "#991B1B";
  var borderColor = cfg.borderColor || "#FECACA";
  var borderWidth = typeof cfg.borderWidth === "number" ? cfg.borderWidth : 1;
  var borderStyle = cfg.borderStyle || "solid";
  var borderRadius = typeof cfg.borderRadius === "number" ? cfg.borderRadius : 8;

  var paddingVertical = typeof cfg.paddingVertical === "number" ? cfg.paddingVertical : 8;
  var paddingHorizontal = typeof cfg.paddingHorizontal === "number" ? cfg.paddingHorizontal : 12;
  var marginTop = typeof cfg.marginTop === "number" ? cfg.marginTop : 8;
  var marginBottom = typeof cfg.marginBottom === "number" ? cfg.marginBottom : 8;

  var fontSize = typeof cfg.fontSize === "number" ? cfg.fontSize : 13;
  var fontWeight = cfg.fontWeight || "normal";
  var animationEffect = cfg.animationEffect || "none";
  var animationTarget = cfg.animationTarget || "icon";

  // Presets de campaña
  var THEMES = {
    "black-friday": { bg: "#111827", text: "#F59E0B", border: "#F59E0B" },
    "hot-sale": { bg: "#0F172A", text: "#ffffff", border: "#EF4444" },
    "cyber-monday": { bg: "#090D16", text: "#ffffff", border: "#3B82F6" },
    "navidad": { bg: "#064E3B", text: "#ffffff", border: "#EF4444" },
    "san-valentin": { bg: "#831843", text: "#ffffff", border: "#F43F5E" },
    "dia-padre-madre": { bg: "#312E81", text: "#ffffff", border: "#10B981" },
    "liquidacion": { bg: "#7F1D1D", text: "#FBBF24", border: "#FBBF24" }
  };

  if (cfg.campaignTheme && cfg.campaignTheme !== "none" && THEMES[cfg.campaignTheme]) {
    var t = THEMES[cfg.campaignTheme];
    bgColor = t.bg;
    textColor = t.text;
    borderColor = t.border;
  }

  // Obtener stock real del producto en Tiendanube
  var currentStock = null;
  try {
    if (window.LS && window.LS.product) {
      var p = window.LS.product;
      if (p.variants && p.variants.length > 0) {
        for (var v = 0; v < p.variants.length; v++) {
          if (p.variants[v].stock !== undefined && p.variants[v].stock !== null) {
            currentStock = parseInt(p.variants[v].stock, 10);
            break;
          }
        }
      }
      if (currentStock === null && p.stock !== undefined && p.stock !== null) {
        currentStock = parseInt(p.stock, 10);
      }
    }
  } catch(e) {}

  // Fallback de demostración si el stock no es expuesto por el tema
  if (currentStock === null || isNaN(currentStock)) {
    currentStock = 3;
  }

  // Si el stock supera el umbral configurado, no mostrar el widget
  if (currentStock > threshold) {
    return;
  }

  // Seleccionar mensaje (Última unidad o mensaje general)
  var rawText = (enableLastUnitMsg && currentStock === 1) ? lastUnitText : messageText;
  var finalText = rawText.replace(/\{cantidad\}/g, currentStock.toString());

  // Escapar HTML y parsear formato Markdown **negrita**
  var safeText = typeof escapeHtml === "function" ? escapeHtml(finalText) : finalText;
  var formattedHtml = safeText.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 800;">$1</strong>');

  // Inyección de CSS y Animaciones
  var styleId = "style-" + elementId;
  if (!document.getElementById(styleId)) {
    var borderCss = (borderColor && borderColor !== "transparent" && borderWidth > 0)
      ? borderWidth + "px " + borderStyle + " " + borderColor
      : "none";

    var keyframes = "";
    if (animationEffect === "aureola") {
      keyframes =
        "@keyframes nvxAureolaPulse { " +
          "0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); } " +
          "70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); } " +
          "100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } " +
        "} ";
    } else if (animationEffect === "zoom") {
      keyframes =
        "@keyframes nvxZoomPulse { " +
          "0% { transform: scale(1); } " +
          "50% { transform: scale(1.08); } " +
          "100% { transform: scale(1); } " +
        "} ";
    }

    var animClassWidget = "";
    var animClassIcon = "";

    if (animationEffect === "aureola") {
      if (animationTarget === "widget") animClassWidget = "animation: nvxAureolaPulse 2s infinite !important; ";
      else animClassIcon = "animation: nvxAureolaPulse 2s infinite !important; border-radius: 50% !important; ";
    } else if (animationEffect === "zoom") {
      if (animationTarget === "widget") animClassWidget = "animation: nvxZoomPulse 1.8s infinite ease-in-out !important; ";
      else animClassIcon = "animation: nvxZoomPulse 1.8s infinite ease-in-out !important; ";
    }

    var styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.type = "text/css";
    var css = keyframes +
      "#" + elementId + " { " +
        "background: " + bgColor + " !important; " +
        "border: " + borderCss + " !important; " +
        "border-radius: " + borderRadius + "px !important; " +
        "padding: " + paddingVertical + "px " + paddingHorizontal + "px !important; " +
        "margin-top: " + marginTop + "px !important; " +
        "margin-bottom: " + marginBottom + "px !important; " +
        "color: " + textColor + " !important; " +
        "font-size: " + fontSize + "px !important; " +
        "font-weight: " + (fontWeight === "bold" ? "700" : "400") + " !important; " +
        "box-sizing: border-box !important; " +
        "display: flex !important; " +
        "align-items: center !important; " +
        "justify-content: center !important; " +
        "gap: 8px !important; " +
        "width: 100% !important; " +
        "max-width: 100% !important; " +
        "clear: both !important; " +
        "text-align: center !important; " +
        "font-family: system-ui, -apple-system, sans-serif !important; " +
        animClassWidget +
      "} " +
      "#" + elementId + " .nvx-icon-target { " +
        "display: inline-flex !important; " +
        "align-items: center !important; " +
        "justify-content: center !important; " +
        animClassIcon +
      "}";

    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);
  }

  // Construcción del HTML del Ícono
  var iconHtml = "";
  if (iconType === "circle") {
    iconHtml = '<span class="nvx-icon-target" style="width:10px;height:10px;border-radius:50%;background:#EF4444;flex-shrink:0;"></span>';
  } else if (iconType === "heart") {
    iconHtml = '<span class="nvx-icon-target" style="font-size:16px;flex-shrink:0;">❤️</span>';
  } else if (iconType === "alert") {
    iconHtml = '<span class="nvx-icon-target" style="font-size:16px;flex-shrink:0;">⚠️</span>';
  } else if (iconType === "emoji") {
    var safeEmoji = typeof escapeHtml === "function" ? escapeHtml(customEmoji) : customEmoji;
    iconHtml = '<span class="nvx-icon-target" style="font-size:16px;flex-shrink:0;">' + safeEmoji + '</span>';
  } else if (iconType === "image" && iconImageUrl) {
    var safeImg = typeof escapeHtml === "function" ? escapeHtml(iconImageUrl) : iconImageUrl;
    iconHtml = '<span class="nvx-icon-target"><img src="' + safeImg + '" alt="Icon" style="width:18px;height:18px;object-fit:contain;display:block;" /></span>';
  }

  var container = document.createElement("div");
  container.id = elementId;
  container.className = "nvx-widget nvx-alerta-inventario-wrapper";
  container.innerHTML = iconHtml + '<span>' + formattedHtml + '</span>';

  // Posicionamiento DOM
  var targetEl = null;

  if (position === "before-desc") {
    // Arriba de la Descripción
    var descSelectors = [
      ".js-product-description",
      "#description",
      ".product-description",
      ".product-detail-description",
      ".user-content"
    ];
    for (var dIdx = 0; dIdx < descSelectors.length; dIdx++) {
      var dEl = document.querySelector(descSelectors[dIdx]);
      if (dEl) {
        targetEl = dEl;
        break;
      }
    }
    if (targetEl && targetEl.parentNode) {
      targetEl.parentNode.insertBefore(container, targetEl);
    }
  }

  // Fallback o posición "above-cart" (Arriba del botón de comprar)
  if (!container.parentNode) {
    var buySelectors = [
      "form[action*='/cart/add']",
      "form.js-product-form",
      ".js-product-buy-container",
      ".product-buy-container",
      "form.js-product-buyform",
      ".js-add-to-cart-btn",
      "#product_form"
    ];
    for (var bIdx = 0; bIdx < buySelectors.length; bIdx++) {
      var bEl = document.querySelector(buySelectors[bIdx]);
      if (bEl) {
        targetEl = bEl;
        break;
      }
    }
    if (targetEl && targetEl.parentNode) {
      targetEl.parentNode.insertBefore(container, targetEl);
    } else {
      var main = document.querySelector("main, #content, .main-content, .js-product-container");
      if (main) main.insertBefore(container, main.firstChild);
    }
  }

  // Telemetría Nevux
  if (typeof nvxTrack === "function") {
    nvxTrack(w.id, "impression");
  }
      }
        /* ═══════════════════════════════════════════
   WIDGET: CONJUNTO DE PRODUCTOS (LOOK) v385
   ═══════════════════════════════════════════ */
function renderConjuntoProductos(w) {
  var elementId = "nvx-conjunto-productos-" + w.id;
  if (document.getElementById(elementId)) return;

  var cfg = w.config || {};
  if (typeof cfg === "string") {
    try { cfg = JSON.parse(cfg); } catch(e) { cfg = {}; }
  }

  var currentPage = typeof detectPageType === "function" ? detectPageType() : "";
  if (currentPage !== "product") return;

  var presets = {
    "black-friday": { bg: "#F59E0B", title: "#111827", border: "#D97706", btn: "#111827", btnText: "#F59E0B", btnBorder: "#F59E0B", total: "#111827", lookTitle: "#111827", badge: "#111827", badgeText: "#F59E0B" },
    "hot-sale": { bg: "#EF4444", title: "#ffffff", border: "#B91C1C", btn: "#ffffff", btnText: "#EF4444", btnBorder: "#ffffff", total: "#ffffff", lookTitle: "#ffffff", badge: "#ffffff", badgeText: "#EF4444" },
    "cyber-monday": { bg: "#3B82F6", title: "#ffffff", border: "#1D4ED8", btn: "#ffffff", btnText: "#3B82F6", btnBorder: "#ffffff", total: "#ffffff", lookTitle: "#ffffff", badge: "#ffffff", badgeText: "#3B82F6" },
    "navidad": { bg: "#064E3B", title: "#ffffff", border: "#047857", btn: "#DC2626", btnText: "#ffffff", btnBorder: "#DC2626", total: "#ffffff", lookTitle: "#ffffff", badge: "#DC2626", badgeText: "#ffffff" },
    "san-valentin": { bg: "#831843", title: "#ffffff", border: "#9d174d", btn: "#ffffff", btnText: "#831843", btnBorder: "#ffffff", total: "#ffffff", lookTitle: "#ffffff", badge: "#ffffff", badgeText: "#831843" },
    "dia-padre-madre": { bg: "#312E81", title: "#ffffff", border: "#4338ca", btn: "#ffffff", btnText: "#312E81", btnBorder: "#ffffff", total: "#ffffff", lookTitle: "#ffffff", badge: "#ffffff", badgeText: "#312E81" },
    "liquidacion": { bg: "#7F1D1D", title: "#ffffff", border: "#991b1b", btn: "#FBBF24", btnText: "#7F1D1D", btnBorder: "#FBBF24", total: "#ffffff", lookTitle: "#ffffff", badge: "#FBBF24", badgeText: "#7F1D1D" }
  };

  var theme = cfg.campaignTheme || "none";
  var preset = presets[theme] || null;

  var sectionBgColor = preset ? preset.bg : (cfg.sectionBgColor || "#FAFAFA");
  var sectionTitleColor = preset ? preset.title : (cfg.sectionTitleColor || "#111827");
  var borderColor = preset ? preset.border : (cfg.borderColor || "#E5E7EB");
  var btnBgColor = preset ? preset.btn : (cfg.btnBgColor || "#000000");
  var btnTextColor = preset ? preset.btnText : (cfg.btnTextColor || "#ffffff");
  var btnBorderColor = preset ? preset.btnBorder : (cfg.btnBorderColor || "#000000");
  var totalColor = preset ? preset.total : (cfg.totalColor || "#000000");
  var lookTitleColor = preset ? preset.lookTitle : (cfg.lookTitleColor || "#000000");
  var badgeBgColor = preset ? preset.badge : (cfg.badgeBgColor || "#DC2626");
  var badgeTextColor = preset ? preset.badgeText : (cfg.badgeTextColor || "#ffffff");

  var productItemBgColor = cfg.productItemBgColor || "#ffffff";
  var productNameColor = cfg.productNameColor || "#1F2937";
  var productPriceColor = cfg.productPriceColor || "#4B5563";

  var sectionTitle = cfg.sectionTitle || "";
  var position = cfg.position || "before-desc";
  var borderRadius = typeof cfg.borderRadius === "number" ? cfg.borderRadius : 12;
  var paddingInternal = typeof cfg.paddingInternal === "number" ? cfg.paddingInternal : 16;
  var btnBorderRadius = typeof cfg.btnBorderRadius === "number" ? cfg.btnBorderRadius : 25;
  var sectionTitleSize = cfg.sectionTitleSize || "24px";
  var sectionTitleAlign = cfg.sectionTitleAlign || "center";
  var lookTitleSize = cfg.lookTitleSize || "20px";
  var productNameSize = cfg.productNameSize || "14px";
  var productPriceSize = cfg.productPriceSize || "14px";
  var totalPriceSize = cfg.totalPriceSize || "16px";

  var looks = cfg.looks;
  if (typeof looks === "string") {
    try { looks = JSON.parse(looks); } catch(e) { looks = []; }
  }
  if (!Array.isArray(looks) || looks.length === 0) return;

  var safeEsc = function(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };

  var formatPrice = function(amount) {
    return "$" + Number(amount).toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  var styleId = "style-" + elementId;
  if (!document.getElementById(styleId)) {
    var styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.type = "text/css";
    var css =
      "#" + elementId + " { background:" + sectionBgColor + " !important; border:1px solid " + borderColor + " !important; border-radius:" + borderRadius + "px !important; padding:" + paddingInternal + "px !important; margin-top:16px !important; margin-bottom:16px !important; width:100% !important; box-sizing:border-box !important; font-family:system-ui,-apple-system,sans-serif !important; clear:both !important; } " +
      "#" + elementId + " .nvx-lk-title { color:" + sectionTitleColor + " !important; font-size:" + sectionTitleSize + " !important; font-weight:800 !important; text-align:" + sectionTitleAlign + " !important; margin:0 0 12px 0 !important; } " +
      "#" + elementId + " .nvx-lk-tabs { display:flex !important; gap:8px !important; overflow-x:auto !important; padding-bottom:8px !important; margin-bottom:12px !important; -webkit-overflow-scrolling:touch !important; } " +
      "#" + elementId + " .nvx-lk-tab { background:#fff !important; border:1px solid #D1D5DB !important; border-radius:20px !important; padding:4px 14px !important; font-size:13px !important; font-weight:600 !important; color:#374151 !important; cursor:pointer !important; white-space:nowrap !important; } " +
      "#" + elementId + " .nvx-lk-tab.active { background:" + btnBgColor + " !important; color:" + btnTextColor + " !important; border-color:" + btnBgColor + " !important; } " +
      "#" + elementId + " .nvx-lk-card { display:flex !important; gap:16px !important; box-sizing:border-box !important; } " +
      "#" + elementId + " .nvx-lk-card.rev { flex-direction:row-reverse !important; } " +
      "#" + elementId + " .nvx-lk-img-col { flex:0 0 40% !important; max-width:40% !important; } " +
      "#" + elementId + " .nvx-lk-img { width:100% !important; min-height:200px !important; max-height:380px !important; object-fit:cover !important; border-radius:6px !important; display:block !important; } " +
      "#" + elementId + " .nvx-lk-info { flex:1 !important; display:flex !important; flex-direction:column !important; gap:8px !important; } " +
      "#" + elementId + " .nvx-lk-look-title { font-size:" + lookTitleSize + " !important; font-weight:800 !important; color:" + lookTitleColor + " !important; margin:0 !important; } " +
      "#" + elementId + " .nvx-lk-prods { display:flex !important; flex-direction:column !important; gap:6px !important; } " +
      "#" + elementId + " .nvx-lk-prod { display:flex !important; align-items:center !important; justify-content:space-between !important; background:" + productItemBgColor + " !important; padding:6px 10px !important; border-radius:6px !important; gap:8px !important; } " +
      "#" + elementId + " .nvx-lk-prod-img { width:28px !important; height:28px !important; object-fit:cover !important; border-radius:4px !important; flex-shrink:0 !important; } " +
      "#" + elementId + " .nvx-lk-prod-name { color:" + productNameColor + " !important; font-weight:600 !important; font-size:" + productNameSize + " !important; flex:1 !important; } " +
      "#" + elementId + " .nvx-lk-prod-price { color:" + productPriceColor + " !important; font-weight:700 !important; font-size:" + productPriceSize + " !important; white-space:nowrap !important; } " +
      "#" + elementId + " .nvx-lk-summary { border-top:1px dashed " + borderColor + " !important; padding-top:10px !important; margin-top:6px !important; } " +
      "#" + elementId + " .nvx-lk-total-row { display:flex !important; align-items:center !important; justify-content:space-between !important; margin-bottom:8px !important; } " +
      "#" + elementId + " .nvx-lk-total-label { font-weight:700 !important; color:" + totalColor + " !important; font-size:" + totalPriceSize + " !important; } " +
      "#" + elementId + " .nvx-lk-total-val { font-weight:800 !important; color:" + totalColor + " !important; font-size:" + totalPriceSize + " !important; } " +
      "#" + elementId + " .nvx-lk-badge { background:" + badgeBgColor + " !important; color:" + badgeTextColor + " !important; font-size:11px !important; font-weight:700 !important; padding:2px 8px !important; border-radius:999px !important; margin-right:8px !important; } " +
      "#" + elementId + " .nvx-lk-old-price { text-decoration:line-through !important; color:#9CA3AF !important; font-size:12px !important; margin-right:6px !important; } " +
      "#" + elementId + " .nvx-lk-buy { background:" + btnBgColor + " !important; color:" + btnTextColor + " !important; border:1px solid " + btnBorderColor + " !important; border-radius:" + btnBorderRadius + "px !important; font-size:15px !important; font-weight:700 !important; padding:12px 16px !important; width:100% !important; cursor:pointer !important; text-align:center !important; } " +
      "#" + elementId + " .nvx-lk-buy:hover { opacity:0.9 !important; } " +
      "@media (max-width:640px) { #" + elementId + " .nvx-lk-card, #" + elementId + " .nvx-lk-card.rev { flex-direction:column !important; } #" + elementId + " .nvx-lk-img-col { flex:1 1 100% !important; max-width:100% !important; } #" + elementId + " .nvx-lk-img { height:220px !important; } }";
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);
  }

  var html = "";
  if (sectionTitle) {
    html += '<h3 class="nvx-lk-title">' + safeEsc(sectionTitle) + '</h3>';
  }

  if (looks.length > 1) {
    html += '<div class="nvx-lk-tabs">';
    for (var t = 0; t < looks.length; t++) {
      html += '<button type="button" class="nvx-lk-tab' + (t === 0 ? " active" : "") + '" data-lk="' + t + '">' + safeEsc(looks[t].title || ("Look " + (t + 1))) + '</button>';
    }
    html += '</div>';
  }

  for (var i = 0; i < looks.length; i++) {
    var lk = looks[i];
    var prods = lk.products;
    if (typeof prods === "string") { try { prods = JSON.parse(prods); } catch(e) { prods = []; } }
    if (!Array.isArray(prods)) prods = [];

    var subtotal = 0;
    for (var p = 0; p < prods.length; p++) {
      subtotal += Number(prods[p].price || 0);
    }
    var discType = lk.discountType || "none";
    var discVal = Number(lk.discountValue || 0);
    var hasDisc = discType === "percentage" && discVal > 0;
    var finalTotal = hasDisc ? Math.round(subtotal * (1 - discVal / 100)) : subtotal;
    var isRev = lk.imagePosition === "right" ? " rev" : "";
    var hidden = i > 0 ? ' style="display:none;"' : '';

    html += '<div class="nvx-lk-panel" id="' + elementId + '-p' + i + '"' + hidden + '>';
    html += '<div class="nvx-lk-card' + isRev + '">';

    html += '<div class="nvx-lk-img-col">';
    if (lk.image) {
      html += '<img src="' + safeEsc(lk.image) + '" alt="' + safeEsc(lk.title || "Look") + '" class="nvx-lk-img" />';
    } else {
      html += '<div style="width:100%;height:220px;background:#E5E7EB;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#9CA3AF;font-size:12px;">Sin imagen</div>';
    }
    html += '</div>';

    html += '<div class="nvx-lk-info">';
    if (lk.title) {
      html += '<div class="nvx-lk-look-title">' + safeEsc(lk.title) + '</div>';
    }
    html += '<div class="nvx-lk-prods">';
    for (var k = 0; k < prods.length; k++) {
      var pr = prods[k];
      html += '<div class="nvx-lk-prod">';
      if (pr.image) {
        html += '<img src="' + safeEsc(pr.image) + '" class="nvx-lk-prod-img" alt="" />';
      }
      html += '<span class="nvx-lk-prod-name">' + safeEsc(pr.name || "Producto") + '</span>';
      html += '<span class="nvx-lk-prod-price">' + formatPrice(pr.price || 0) + '</span>';
      html += '</div>';
    }
    html += '</div>';

    html += '<div class="nvx-lk-summary">';
    html += '<div class="nvx-lk-total-row">';
    html += '<span class="nvx-lk-total-label">Total Conjunto:</span>';
    html += '<div>';
    if (hasDisc) {
      html += '<span class="nvx-lk-badge">-' + discVal + '% OFF</span>';
      html += '<span class="nvx-lk-old-price">' + formatPrice(subtotal) + '</span>';
    }
    html += '<span class="nvx-lk-total-val">' + formatPrice(finalTotal) + '</span>';
    html += '</div>';
    html += '</div>';

    html += '<button type="button" class="nvx-lk-buy" data-lk-idx="' + i + '">' + safeEsc(lk.buttonText || "Comprar look") + '</button>';
    html += '</div>';
    html += '</div></div></div>';
  }

  var container = document.createElement("div");
  container.id = elementId;
  container.className = "nvx-widget nvx-conjunto-productos";
  container.innerHTML = html;

  if (looks.length > 1) {
    var tabs = container.querySelectorAll(".nvx-lk-tab");
    for (var b = 0; b < tabs.length; b++) {
      tabs[b].addEventListener("click", function() {
        var idx = this.getAttribute("data-lk");
        for (var x = 0; x < tabs.length; x++) {
          tabs[x].classList.remove("active");
          var pnl = document.getElementById(elementId + "-p" + x);
          if (pnl) pnl.style.display = "none";
        }
        this.classList.add("active");
        var ap = document.getElementById(elementId + "-p" + idx);
        if (ap) ap.style.display = "block";
      });
    }
  }

  var conjuntoProductosOpenCart = function() {
    var cartTriggers = [
      ".js-toggle-cart",
      ".js-modal-open[data-target='#modal-cart']",
      ".js-modal-open[data-target='#cart-modal']",
      ".js-cart-notification",
      ".js-ajax-cart-open",
      ".js-cart-modal",
      "#cart-button",
      ".cart-btn",
      "[data-component='cart.toggle']",
      ".js-open-cart",
      ".js-cart-summary"
    ];
    for (var c = 0; c < cartTriggers.length; c++) {
      var trig = document.querySelector(cartTriggers[c]);
      if (trig && trig.offsetParent !== null) {
        try { trig.click(); return true; } catch (e) {}
      }
    }
    return false;
  };

  var conjuntoProductosResolveVariants = function(prodsList, afterReady) {
    try {
      var xhrRes = new XMLHttpRequest();
      xhrRes.open("GET", "/products.json", true);
      xhrRes.onreadystatechange = function() {
        if (xhrRes.readyState === 4) {
          if (xhrRes.status === 200) {
            try {
              var data = JSON.parse(xhrRes.responseText);
              var items = Array.isArray(data) ? data : (data.products || []);
              var vMap = {};
              for (var j = 0; j < items.length; j++) {
                if (items[j] && items[j].id && items[j].variants && items[j].variants[0]) {
                  vMap[String(items[j].id)] = items[j].variants[0].id;
                }
              }
              for (var kk = 0; kk < prodsList.length; kk++) {
                var pItem = prodsList[kk];
                var pidItem = pItem.product_id || pItem.id;
                if (!pItem.variant_id || String(pItem.variant_id) === String(pidItem)) {
                  if (vMap[String(pidItem)]) {
                    prodsList[kk].variant_id = vMap[String(pidItem)];
                  }
                }
              }
            } catch (eP) {}
          }
          afterReady(prodsList);
        }
      };
      xhrRes.send();
    } catch (eX) {
      afterReady(prodsList);
    }
  };

  var buyBtns = container.querySelectorAll(".nvx-lk-buy");
  for (var g = 0; g < buyBtns.length; g++) {
    buyBtns[g].addEventListener("click", function() {
      var lkIdx = parseInt(this.getAttribute("data-lk-idx"), 10);
      var lkData = looks[lkIdx];
      var prodsList = lkData.products;
      if (typeof prodsList === "string") { try { prodsList = JSON.parse(prodsList); } catch(e) { prodsList = []; } }
      if (!Array.isArray(prodsList) || prodsList.length === 0) return;

      var btn = this;
      var origText = lkData.buttonText || "Comprar look";
      btn.textContent = "Agregando...";
      btn.style.opacity = "0.7";
      btn.disabled = true;

      conjuntoProductosResolveVariants(prodsList, function(readyList) {

        var addNext = function(index) {
          if (index >= readyList.length) {
            btn.textContent = "\u2713 \u00a1Agregado al carrito!";
            btn.style.opacity = "1";
            btn.style.background = "#10B981";

            setTimeout(function() {
              var opened = conjuntoProductosOpenCart();
              if (!opened) {
                if (typeof window.nube !== "undefined" && window.nube && typeof window.nube.send === "function") {
                  try {
                    window.nube.send("cart:open");
                    return;
                  } catch (eOpen) {}
                }
                setTimeout(function() { window.location.reload(); }, 400);
              }
            }, 400);

            setTimeout(function() {
              btn.textContent = origText;
              btn.style.background = "";
              btn.disabled = false;
            }, 3000);
            return;
          }

          var prod = readyList[index];
          var pid = prod.product_id || prod.id;
          var vid = prod.variant_id || (prod.variants && prod.variants[0] ? prod.variants[0].id : null) || pid;

          if (typeof window.nube !== "undefined" && window.nube && typeof window.nube.send === "function") {
            try {
              (function(cpPid, cpVid) {
                window.nube.send("cart:add", function() {
                  return {
                    cart: {
                      items: [{ product_id: Number(cpPid), variant_id: Number(cpVid), quantity: 1 }]
                    }
                  };
                });
              })(pid, vid);
              setTimeout(function() { addNext(index + 1); }, 500);
              return;
            } catch (errNube) {
              console.warn("[Nevux Conjunto Productos] NubeSDK fallo, usando fallback:", errNube);
            }
          }

          try {
            var fd = new FormData();
            fd.append("add_to_cart", String(pid));
            if (vid) fd.append("variant_id", String(vid));
            fd.append("quantity", "1");

            var xhrAdd = new XMLHttpRequest();
            xhrAdd.open("POST", "/comprar/", true);
            xhrAdd.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhrAdd.withCredentials = true;
            xhrAdd.onreadystatechange = function() {
              if (xhrAdd.readyState === 4) {
                addNext(index + 1);
              }
            };
            xhrAdd.send(fd);
          } catch (errXhr) {
            addNext(index + 1);
          }
        };

        addNext(0);
      });
    });
  }

  var targetEl = null;
  if (position === "after-desc") {
    var descSels = [".js-product-description", "[data-store='product-description']", "#description", ".product-description", ".user-content", ".js-product-tabs", ".product-detail-description"];
    for (var d = 0; d < descSels.length; d++) {
      var dEl = document.querySelector(descSels[d]);
      if (dEl) { targetEl = dEl; break; }
    }
    if (!targetEl) {
      var headings = document.querySelectorAll("h2, h3, h4, .tab-header, .accordion-header");
      for (var h = 0; h < headings.length; h++) {
        if (headings[h].textContent.toLowerCase().indexOf("descripci") !== -1) {
          targetEl = headings[h].parentNode || headings[h];
          break;
        }
      }
    }
    if (targetEl && targetEl.parentNode) {
      targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
    }
  }

  if (!container.parentNode) {
    var formSels = ["form[action*='/cart/add']", "form.js-product-form", "#product_form", ".js-product-buy-container"];
    for (var f = 0; f < formSels.length; f++) {
      var fEl = document.querySelector(formSels[f]);
      if (fEl) { targetEl = fEl; break; }
    }
    if (targetEl && targetEl.parentNode) {
      targetEl.parentNode.insertBefore(container, targetEl.nextSibling);
    } else {
      var main = document.querySelector(".js-product-container, .product-detail, main, #content");
      if (main) main.appendChild(container);
    }
  }

  if (typeof nvxTrack === "function") nvxTrack(w.id, "impression");
}
  /* ═══════════════════════════════════════════
   WIDGET: CARRUSEL DE RESEÑAS (PRODUCTO)
   ═══════════════════════════════════════════ */
function renderCarruselResenas(w) {
  var elementId = "nvx-carrusel-" + w.id;
  if (document.getElementById(elementId)) return;

  var cfg = w.config || {};

  // Verificación estricta: SOLO en Ficha de Producto
  var currentPage = typeof detectPageType === "function" ? detectPageType() : "";
  if (currentPage !== "product") {
    return;
  }

  var title = cfg.title !== undefined ? cfg.title : "Lo que dicen nuestros clientes";
  var subtitle = cfg.subtitle !== undefined ? cfg.subtitle : "Reseñas verificadas por clientes reales.";
  var showHeaderStars = cfg.showHeaderStars !== false;
  var showCtaButton = cfg.showCtaButton !== false;
  var ctaButtonText = cfg.ctaButtonText || "Ver más opiniones";
  var ctaButtonLink = cfg.ctaButtonLink || "#";
  var location = cfg.location || "product_after";

  // Soporte Fechas Especiales (THEMES idénticos al Editor)
  var THEMES = {
    "black-friday": { bg: "#0b0f19", title: "#ffffff", subtitle: "#9ca3af", text: "#d1d5db", star: "#ef4444", headerStar: "#ef4444", cardBg: "#111827", border: "#1f2937", ctaBg: "#ef4444", ctaText: "#ffffff" },
    "hot-sale": { bg: "#ff4800", title: "#ffffff", subtitle: "#ffded4", text: "#333333", star: "#ff4800", headerStar: "#ffffff", cardBg: "#ffffff", border: "#ffd2c7", ctaBg: "#ffffff", ctaText: "#ff4800" },
    "cyber-monday": { bg: "#0055ff", title: "#ffffff", subtitle: "#d1e0ff", text: "#1e293b", star: "#0055ff", headerStar: "#ffffff", cardBg: "#ffffff", border: "#bfdbfe", ctaBg: "#ffffff", ctaText: "#0055ff" },
    "navidad": { bg: "#0f5132", title: "#ffffff", subtitle: "#d1e7dd", text: "#1e293b", star: "#dc2626", headerStar: "#fbbf24", cardBg: "#ffffff", border: "#a3e635", ctaBg: "#dc2626", ctaText: "#ffffff" },
    "san-valentin": { bg: "#fff0f3", title: "#9f1239", subtitle: "#be123c", text: "#4c0519", star: "#e11d48", headerStar: "#e11d48", cardBg: "#ffffff", border: "#fecdd3", ctaBg: "#e11d48", ctaText: "#ffffff" },
    "dia-padre-madre": { bg: "#f8fafc", title: "#0f172a", subtitle: "#475569", text: "#334155", star: "#0284c7", headerStar: "#0284c7", cardBg: "#ffffff", border: "#e2e8f0", ctaBg: "#0f172a", ctaText: "#ffffff" },
    "liquidacion": { bg: "#facc15", title: "#000000", subtitle: "#713f12", text: "#1c1917", star: "#000000", headerStar: "#000000", cardBg: "#ffffff", border: "#eab308", ctaBg: "#000000", ctaText: "#ffffff" }
  };

  var bgColor = cfg.bgColor || "#ffffff";
  var titleColor = cfg.titleColor || "#1a1a1a";
  var subtitleColor = cfg.subtitleColor || "#4b5563";
  var textColor = cfg.textColor || "#4b5563";
  var starColor = cfg.starColor || "#f5b301";
  var headerStarColor = cfg.headerStarColor || "#f5a623";
  var cardBgColor = cfg.cardBgColor || "#f9fafb";
  var borderColor = cfg.borderColor || "#e5e7eb";
  var ctaBgColor = cfg.ctaBgColor || "#1a1a1a";
  var ctaTextColor = cfg.ctaTextColor || "#ffffff";

  if (cfg.campaignTheme && cfg.campaignTheme !== "none" && THEMES[cfg.campaignTheme]) {
    var t = THEMES[cfg.campaignTheme];
    bgColor = t.bg;
    titleColor = t.title;
    subtitleColor = t.subtitle;
    textColor = t.text;
    starColor = t.star;
    headerStarColor = t.headerStar;
    cardBgColor = t.cardBg;
    borderColor = t.border;
    ctaBgColor = t.ctaBg;
    ctaTextColor = t.ctaText;
  }

  // Asegura legibilidad del nombre dentro de la tarjeta
  var cardNameColor = (cardBgColor.toLowerCase() === "#ffffff" || cardBgColor.toLowerCase() === "#f9fafb") ? "#111827" : titleColor;

  var titleFontSize = cfg.titleFontSize || 22;
  var subtitleFontSize = cfg.subtitleFontSize || 16;
  var nameFontSize = cfg.nameFontSize || 16;
  var textFontSize = cfg.textFontSize || 15;
  var starFontSize = cfg.starFontSize || 14;
  var headerStarFontSize = cfg.headerStarFontSize || 28;

  var cardRadius = cfg.cardRadius !== undefined ? cfg.cardRadius : 18;
  var cardPadding = cfg.cardPadding !== undefined ? cfg.cardPadding : 18;
  var borderWidth = cfg.borderWidth !== undefined ? cfg.borderWidth : 1;
  var speed = cfg.speed || 50;
  var ctaBorderRadius = cfg.ctaBorderRadius !== undefined ? cfg.ctaBorderRadius : 50;

  var reviews = cfg.reviews && cfg.reviews.length > 0 ? cfg.reviews : [
    { id: "1", name: "Camila R.", rating: 5, text: "La calidad del producto superó mis expectativas. Llegó en perfecto estado.", icon: "verified" },
    { id: "2", name: "Gonzalo M.", rating: 5, text: "Excelente atención al cliente y el embalaje impecable. Definitivamente voy a volver a comprar.", icon: "google" },
    { id: "3", name: "Lucía P.", rating: 5, text: "Hermoso producto, exacto a las fotos de la publicación. La experiencia de compra fue 10/10.", icon: "mercadolibre" }
  ];

  // Inyección de estilos específicos
  var styleId = "style-" + elementId;
  if (!document.getElementById(styleId)) {
    var styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.type = "text/css";
    var css =
      "#" + elementId + " { " +
        "background: " + bgColor + " !important; " +
        "padding: 28px 16px !important; " +
        "border-radius: 16px !important; " +
        "margin: 20px 0 !important; " +
        "width: 100% !important; " +
        "max-width: 100% !important; " +
        "box-sizing: border-box !important; " +
        "overflow: hidden !important; " +
        "font-family: system-ui, -apple-system, sans-serif !important; " +
        "text-align: center !important; " +
      "} " +
      "#" + elementId + " .nvx-carrusel-header { " +
        "margin-bottom: 20px !important; " +
        "display: flex !important; " +
        "flex-direction: column !important; " +
        "align-items: center !important; " +
      "} " +
      "#" + elementId + " .nvx-carrusel-header-stars { " +
        "color: " + headerStarColor + " !important; " +
        "font-size: " + headerStarFontSize + "px !important; " +
        "line-height: 1 !important; " +
        "margin-bottom: 8px !important; " +
        "letter-spacing: 2px !important; " +
      "} " +
      "#" + elementId + " .nvx-carrusel-title { " +
        "color: " + titleColor + " !important; " +
        "font-size: " + titleFontSize + "px !important; " +
        "font-weight: 800 !important; " +
        "margin: 0 0 6px 0 !important; " +
        "line-height: 1.2 !important; " +
      "} " +
      "#" + elementId + " .nvx-carrusel-subtitle { " +
        "color: " + subtitleColor + " !important; " +
        "font-size: " + subtitleFontSize + "px !important; " +
        "margin: 0 !important; " +
        "line-height: 1.4 !important; " +
      "} " +
      "#" + elementId + " .nvx-marquee-wrapper { " +
        "width: 100% !important; " +
        "overflow: hidden !important; " +
        "position: relative !important; " +
      "} " +
      "#" + elementId + " .nvx-marquee-track { " +
        "display: flex !important; " +
        "gap: 16px !important; " +
        "width: max-content !important; " +
        "animation: nvxMarqueeAnim_" + elementId + " " + speed + "s linear infinite !important; " +
        "padding: 4px 0 !important; " +
      "} " +
      "#" + elementId + " .nvx-marquee-track:hover { " +
        "animation-play-state: paused !important; " +
      "} " +
      "#" + elementId + " .nvx-carrusel-card { " +
        "background: " + cardBgColor + " !important; " +
        "border: " + borderWidth + "px solid " + borderColor + " !important; " +
        "border-radius: " + cardRadius + "px !important; " +
        "padding: " + cardPadding + "px !important; " +
        "width: 270px !important; " +
        "max-width: 270px !important; " +
        "flex-shrink: 0 !important; " +
        "text-align: left !important; " +
        "display: flex !important; " +
        "flex-direction: column !important; " +
        "gap: 8px !important; " +
        "box-sizing: border-box !important; " +
      "} " +
      "#" + elementId + " .nvx-card-top { " +
        "display: flex !important; " +
        "align-items: center !important; " +
        "justify-content: space-between !important; " +
        "gap: 8px !important; " +
      "} " +
      "#" + elementId + " .nvx-card-name { " +
        "font-size: " + nameFontSize + "px !important; " +
        "font-weight: 800 !important; " +
        "color: " + cardNameColor + " !important; " +
        "overflow: hidden !important; " +
        "text-overflow: ellipsis !important; " +
        "white-space: nowrap !important; " +
      "} " +
      "#" + elementId + " .nvx-card-stars { " +
        "font-size: " + starFontSize + "px !important; " +
        "color: " + starColor + " !important; " +
        "line-height: 1 !important; " +
      "} " +
      "#" + elementId + " .nvx-card-photo { " +
        "width: 100% !important; " +
        "height: 140px !important; " +
        "object-fit: cover !important; " +
        "border-radius: " + Math.max(4, cardRadius - 6) + "px !important; " +
        "display: block !important; " +
      "} " +
      "#" + elementId + " .nvx-card-text { " +
        "font-size: " + textFontSize + "px !important; " +
        "color: " + textColor + " !important; " +
        "margin: 0 !important; " +
        "line-height: 1.4 !important; " +
        "word-break: break-word !important; " +
      "} " +
      "#" + elementId + " .nvx-carrusel-cta { " +
        "margin-top: 22px !important; " +
      "} " +
      "#" + elementId + " .nvx-carrusel-btn { " +
        "display: inline-block !important; " +
        "background: " + ctaBgColor + " !important; " +
        "color: " + ctaTextColor + " !important; " +
        "border-radius: " + ctaBorderRadius + "px !important; " +
        "padding: 12px 28px !important; " +
        "font-size: 14px !important; " +
        "font-weight: 800 !important; " +
        "text-decoration: none !important; " +
        "box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important; " +
      "} " +
      "@media (max-width: 600px) { " +
        "#" + elementId + " .nvx-carrusel-card { " +
          "width: 250px !important; " +
          "max-width: 250px !important; " +
        "} " +
      "} " +
      "@keyframes nvxMarqueeAnim_" + elementId + " { " +
        "0% { transform: translateX(0); } " +
        "100% { transform: translateX(-50%); } " +
      "}";
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);
  }

  var container = document.createElement("div");
  container.id = elementId;
  container.className = "nvx-widget nvx-carrusel-resenas-wrapper";

  // HTML del Encabezado
  var headerHtml = '<div class="nvx-carrusel-header">';
  if (showHeaderStars) {
    headerHtml += '<div class="nvx-carrusel-header-stars">★★★★★</div>';
  }
  if (title) {
    headerHtml += '<h3 class="nvx-carrusel-title">' + (typeof escapeHtml === "function" ? escapeHtml(title) : title) + '</h3>';
  }
  if (subtitle) {
    headerHtml += '<p class="nvx-carrusel-subtitle">' + (typeof escapeHtml === "function" ? escapeHtml(subtitle) : subtitle) + '</p>';
  }
  headerHtml += '</div>';

  // SVGs para iconos de insignias
  var googleSvg = '<svg width="18" height="18" viewBox="0 0 24 24" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>';
  var mlSvg = '<span style="display:inline-flex;align-items:center;justify-content:center;background:#FFE600;color:#2D3277;border-radius:50%;width:18px;height:18px;font-size:10px;font-weight:900;line-height:1;flex-shrink:0;">ml</span>';
  var verifiedSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="#10B981" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';

  // Render de tarjetas de reseña
  function renderSingleCard(r) {
    var stars = "";
    var numRating = r.rating || 5;
    for (var s = 0; s < 5; s++) {
      stars += s < numRating ? "★" : "☆";
    }

    var badgeIconHtml = "";
    if (r.icon === "google") badgeIconHtml = googleSvg;
    else if (r.icon === "mercadolibre") badgeIconHtml = mlSvg;
    else if (r.icon === "verified") badgeIconHtml = verifiedSvg;

    var photoHtml = r.photo ? '<img src="' + r.photo + '" alt="Foto reseña" class="nvx-card-photo" />' : '';

    return (
      '<div class="nvx-carrusel-card">' +
        '<div class="nvx-card-top">' +
          '<span class="nvx-card-name">' + (typeof escapeHtml === "function" ? escapeHtml(r.name) : r.name) + '</span>' +
          badgeIconHtml +
        '</div>' +
        '<div class="nvx-card-stars">' + stars + '</div>' +
        photoHtml +
        '<p class="nvx-card-text">' + (typeof escapeHtml === "function" ? escapeHtml(r.text) : r.text) + '</p>' +
      '</div>'
    );
  }

  // Multiplicamos la lista para lograr un scroll infinito fluido
  var listToRepeat = reviews.concat(reviews);
  if (listToRepeat.length < 6) {
    listToRepeat = listToRepeat.concat(reviews).concat(reviews);
  }

  var trackInnerHtml = "";
  for (var i = 0; i < listToRepeat.length; i++) {
    trackInnerHtml += renderSingleCard(listToRepeat[i]);
  }

  var marqueeHtml =
    '<div class="nvx-marquee-wrapper">' +
      '<div class="nvx-marquee-track">' +
        trackInnerHtml +
      '</div>' +
    '</div>';

  // Botón CTA opcional
  var ctaHtml = "";
  if (showCtaButton && ctaButtonText) {
    ctaHtml =
      '<div class="nvx-carrusel-cta">' +
        '<a href="' + (ctaButtonLink || "#") + '" class="nvx-carrusel-btn">' + (typeof escapeHtml === "function" ? escapeHtml(ctaButtonText) : ctaButtonText) + '</a>' +
      '</div>';
  }

  container.innerHTML = headerHtml + marqueeHtml + ctaHtml;

  // Inserción en el DOM
  var targetEl = null;

  if (location === "product_before") {
    var buySelectors = [
      "form[action*='/cart/add']",
      "form.js-product-form",
      ".js-product-buy-container",
      ".product-buy-container",
      "form.js-product-buyform",
      ".js-add-to-cart-btn",
      "#product_form"
    ];
    for (var bIdx = 0; bIdx < buySelectors.length; bIdx++) {
      var bEl = document.querySelector(buySelectors[bIdx]);
      if (bEl) { targetEl = bEl; break; }
    }
    if (targetEl && targetEl.parentNode) {
      targetEl.parentNode.insertBefore(container, targetEl);
    }
  }

  if (!container.parentNode) {
    var mainSelectors = ["main", "#content", ".main-content", ".js-product-container", ".product-detail"];
    for (var mIdx = 0; mIdx < mainSelectors.length; mIdx++) {
      var mEl = document.querySelector(mainSelectors[mIdx]);
      if (mEl) { targetEl = mEl; break; }
    }
    if (targetEl) {
      targetEl.appendChild(container);
    } else {
      document.body.appendChild(container);
    }
  }

  // Telemetría Nevux
  if (typeof nvxTrack === "function") {
    nvxTrack(w.id, "impression");
  }
}
        /* ═══════════════════════════════════════════
   WIDGET: CAJA DE ESTADÍSTICAS (v390)
   ═══════════════════════════════════════════ */
var renderCajaEstadisticas = function(w) {
  var pType = typeof detectPageType === "function" ? detectPageType() : "";
  var isProductPage = pType === "product" || pType === "item";
  if (!isProductPage) return;

  // Siempre recrear para que el cambio de columnas (sobre todo 3) no herede el grid anterior
  var existing = document.getElementById("nvx-caja-estadisticas-product");
  if (existing && existing.parentNode) {
    existing.parentNode.removeChild(existing);
  }

  var cfg = w.config || {};

  var presets = {
    "black-friday": { contenedor: "#111827", titulo: "#ffffff", numero: "#F59E0B", etiqueta: "#ffffff", texto: "#9ca3af", borde: "#F59E0B" },
    "hot-sale": { contenedor: "#0F172A", titulo: "#ffffff", numero: "#38BDF8", etiqueta: "#ffffff", texto: "#94a3b8", borde: "#3B82F6" },
    "cyber-monday": { contenedor: "#090D16", titulo: "#ffffff", numero: "#10B981", etiqueta: "#ffffff", texto: "#94a3b8", borde: "#10B981" },
    "navidad": { contenedor: "#064E3B", titulo: "#ffffff", numero: "#FBBF24", etiqueta: "#ffffff", texto: "#a7f3d0", borde: "#EF4444" },
    "san-valentin": { contenedor: "#fdf2f8", titulo: "#831843", numero: "#E11D48", etiqueta: "#831843", texto: "#9d174d", borde: "#F43F5E" },
    "dia-padre-madre": { contenedor: "#312E81", titulo: "#ffffff", numero: "#10B981", etiqueta: "#ffffff", texto: "#c7d2fe", borde: "#10B981" },
    "liquidacion": { contenedor: "#7F1D1D", titulo: "#ffffff", numero: "#FBBF24", etiqueta: "#ffffff", texto: "#fecaca", borde: "#FBBF24" }
  };

  var theme = cfg.campaignTheme || "none";
  var presetTheme = presets[theme] || null;

  var formatMarkdown = function(text) {
    if (!text) return "";
    return String(text).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  };

  var rawTitulo = cfg.titulo !== undefined ? cfg.titulo : "Nuestros números nos avalan";
  var titulo = String(rawTitulo).trim();

  var defaultStats = [
    { icon: "👥", numero: "+15.000", etiqueta: "Clientes felices", texto: "Compraron este año" },
    { icon: "⭐", numero: "4.9 / 5", etiqueta: "Valoración media", texto: "Más de 2.000 reseñas" },
    { icon: "⚡", numero: "24hs", etiqueta: "Despacho exprés", texto: "Envíos a todo el país" }
  ];

  var stats = (cfg.items && cfg.items.length > 0)
    ? cfg.items
    : ((cfg.stats && cfg.stats.length > 0) ? cfg.stats : defaultStats);

  // ── Columnas: lectura estricta de 1 | 2 | 3 | 4 (sin pisar el 3) ──
  var rawCols = cfg.columnas;
  if (rawCols === undefined || rawCols === null || rawCols === "") {
    rawCols = cfg.cols_desktop !== undefined ? cfg.cols_desktop : (cfg.colsDesktop !== undefined ? cfg.colsDesktop : "3");
  }
  var cols = parseInt(String(rawCols).trim(), 10);
  if (isNaN(cols) || cols < 1) cols = 3;
  if (cols > 4) cols = 4;
  // Misma cantidad en móvil y desktop: lo que eligió el merchant
  var gridCols = String(cols);

  var colorContenedor = presetTheme ? presetTheme.contenedor : (cfg.color_fondo || "#ffffff");
  var colorBorde = presetTheme ? presetTheme.borde : (cfg.color_borde || "#e5e7eb");
  var colorTitulo = presetTheme ? presetTheme.titulo : (cfg.color_titulo || "#111827");
  var colorNumero = presetTheme ? presetTheme.numero : (cfg.color_numero || "#10B981");
  var colorEtiqueta = presetTheme ? presetTheme.etiqueta : (cfg.color_etiqueta || "#111827");
  var colorTexto = presetTheme ? presetTheme.texto : (cfg.color_texto || "#6b7280");

  var numberSize = "22px";
  if (cfg.tamano_numero === "pequeno") numberSize = "18px";
  else if (cfg.tamano_numero === "grande") numberSize = "28px";

  var textSize = "13px";
  if (cfg.tamano_texto === "pequeno") textSize = "11px";
  else if (cfg.tamano_texto === "grande") textSize = "15px";

  var borderRadius = (cfg.borde_redondeado !== undefined ? cfg.borde_redondeado : 12) + "px";
  var paddingContainer = (cfg.padding !== undefined ? cfg.padding : 16) + "px";
  var marginTop = (cfg.margin_top !== undefined ? cfg.margin_top : 16) + "px";
  var marginBottom = (cfg.margin_bottom !== undefined ? cfg.margin_bottom : 16) + "px";
  var ubicacion = cfg.ubicacion || "debajo_precio";

  var container = document.createElement("div");
  container.id = "nvx-caja-estadisticas-product";
  container.setAttribute("data-nvx-cols", gridCols);
  container.style.cssText =
    "box-sizing: border-box !important;" +
    "width: 100% !important;" +
    "max-width: 100% !important;" +
    "margin-top: " + marginTop + " !important;" +
    "margin-bottom: " + marginBottom + " !important;" +
    "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;" +
    "clear: both !important;";

  // Grid fijo según columnas elegidas (1, 2, 3 o 4) — sin media query que pise el 3
  var styleTag = document.createElement("style");
  styleTag.type = "text/css";
  styleTag.innerHTML =
    "#nvx-caja-estadisticas-product .nvx-stats-grid {" +
      "display: grid !important;" +
      "grid-template-columns: repeat(" + gridCols + ", minmax(0, 1fr)) !important;" +
      "gap: 12px !important;" +
      "width: 100% !important;" +
      "box-sizing: border-box !important;" +
      "align-items: start !important;" +
    "}" +
    "#nvx-caja-estadisticas-product .nvx-stats-item {" +
      "min-width: 0 !important;" +
      "max-width: 100% !important;" +
      "box-sizing: border-box !important;" +
      "text-align: center !important;" +
      "padding: 4px !important;" +
      "overflow: hidden !important;" +
    "}";
  container.appendChild(styleTag);

  var html = '<div style="background: ' + colorContenedor + " !important;" +
    "padding: " + paddingContainer + " !important;" +
    "border-radius: " + borderRadius + " !important;" +
    "box-shadow: 0 2px 8px rgba(0,0,0,0.03) !important;" +
    "box-sizing: border-box !important;";

  if (colorBorde && colorBorde !== "transparent") {
    html += "border: 1.5px solid " + colorBorde + " !important;";
  } else {
    html += "border: none !important;";
  }
  html += '">';

  if (titulo) {
    html += '<div style="text-align: center !important; margin-bottom: 14px !important;">' +
      '<div style="font-size: 16px !important; font-weight: 800 !important; color: ' + colorTitulo + " !important; line-height: 1.25 !important; word-break: break-word !important;\">" +
        formatMarkdown(titulo) +
      "</div></div>";
  }

  html += '<div class="nvx-stats-grid">';

  for (var i = 0; i < stats.length; i++) {
    var st = stats[i];
    if (!st) continue;

    var iconStr = st.icon || st.icono || "";
    var numStr = st.numero || st.number || "";
    var labelStr = st.etiqueta || st.label || "";
    var textStr = st.texto || st.text || "";

    html += '<div class="nvx-stats-item">';
    if (iconStr) {
      html += '<div style="font-size: 20px !important; margin-bottom: 4px !important; line-height: 1 !important;">' + iconStr + "</div>";
    }
    if (numStr) {
      html += '<div style="font-size: ' + numberSize + " !important; font-weight: 800 !important; color: " + colorNumero +
        " !important; line-height: 1.1 !important; word-break: break-word !important; overflow-wrap: anywhere !important;\">" +
        formatMarkdown(numStr) + "</div>";
    }
    if (labelStr) {
      html += '<div style="font-size: ' + textSize + " !important; font-weight: 700 !important; color: " + colorEtiqueta +
        " !important; margin-top: 4px !important; line-height: 1.2 !important; word-break: break-word !important; overflow-wrap: anywhere !important;\">" +
        formatMarkdown(labelStr) + "</div>";
    }
    if (textStr) {
      html += '<div style="font-size: 11px !important; color: ' + colorTexto +
        " !important; margin-top: 2px !important; line-height: 1.2 !important; word-break: break-word !important; overflow-wrap: anywhere !important;\">" +
        formatMarkdown(textStr) + "</div>";
    }
    html += "</div>";
  }

  html += "</div></div>";

  var contentWrapper = document.createElement("div");
  contentWrapper.innerHTML = html;
  container.appendChild(contentWrapper);

  var inserted = false;

  if (ubicacion === "encima_formulario" || ubicacion === "above_form" || ubicacion === "product_before") {
    var formEl = document.querySelector("form[action*='/cart/add'], .js-product-form, .product-form, .js-addtocart");
    if (formEl && formEl.parentNode) {
      formEl.parentNode.insertBefore(container, formEl);
      inserted = true;
    }
  }

  if (!inserted) {
    var priceBlock = document.querySelector(
      ".js-price-container, .js-product-price-container, .product-price-container, .price-container, .js-item-price, [data-store='product-price']"
    );
    if (priceBlock && priceBlock.parentNode) {
      var parentBlock = priceBlock.closest
        ? (priceBlock.closest(".js-price-container, .js-product-price-container, .product-price-container, .price-container") || priceBlock.parentNode)
        : priceBlock.parentNode;
      if (parentBlock && parentBlock.parentNode && parentBlock !== document.body) {
        parentBlock.parentNode.insertBefore(container, parentBlock.nextSibling);
        inserted = true;
      } else if (priceBlock.parentNode) {
        priceBlock.parentNode.insertBefore(container, priceBlock.nextSibling);
        inserted = true;
      }
    }
  }

  if (!inserted) {
    var allPrices = document.querySelectorAll(".js-price-display, #price_display, .js-product-price");
    if (allPrices && allPrices.length > 0) {
      var lastP = allPrices[allPrices.length - 1];
      var wrap = lastP.parentNode;
      if (wrap && wrap.parentNode && wrap.parentNode !== document.body) {
        wrap.parentNode.insertBefore(container, wrap.nextSibling);
      } else if (wrap) {
        wrap.insertBefore(container, lastP.nextSibling);
      }
      inserted = true;
    }
  }

  if (!inserted) {
    var fallbackForm = document.querySelector("form[action*='/cart/add'], .js-product-form, .product-form");
    if (fallbackForm && fallbackForm.parentNode) {
      fallbackForm.parentNode.insertBefore(container, fallbackForm);
    } else {
      var mainWrap = document.querySelector(".js-product-detail, .product-detail, main, #single-product");
      if (mainWrap) {
        mainWrap.appendChild(container);
      }
    }
  }
};
          /* ═══════════════════════════════════════════
   WIDGET #47: BARRA DE DESCUENTO
   ═══════════════════════════════════════════ */
function renderBarraDescuento(w) {
  try {
    var cfg = w.config || {};
    var uniqueId = "nvx-discount-bar-" + (w.id || Math.random().toString(36).substring(7));
    if (document.getElementById(uniqueId)) return;

    // Verificar si el usuario la cerró en esta sesión
    var storageKeyClosed = "nvx_discount_bar_closed_" + (w.id || "default");
    if (window.sessionStorage && window.sessionStorage.getItem(storageKeyClosed) === "true") {
      return;
    }

    var textoBarra = cfg.textoBarra !== undefined ? cfg.textoBarra : "¡Aprovechá 10% OFF en tu primera compra con el cupón:";
    var codigoCupon = cfg.codigoCupon !== undefined ? cfg.codigoCupon : "BIENVENIDA10";
    var textoAclaracion = cfg.textoAclaracion || "";
    var mostrarContador = cfg.mostrarContador !== false;
    var horasContador = parseInt(cfg.horasContador, 10) || 2;
    var minutosContador = parseInt(cfg.minutosContador, 10) || 45;
    var posicion = (cfg.posicion || "arriba").toString().toLowerCase();
    var mostrarCerrar = cfg.mostrarCerrar !== false;

    // Evaluar posición arriba o abajo (soporta 'arriba', 'top', 'fixed-top', 'header')
    var isTop = (posicion === "arriba" || posicion === "top" || posicion === "fixed-top" || posicion === "header");

    var colorFondo = cfg.colorFondo || "#111827";
    var paddingVertical = cfg.paddingVertical !== undefined ? parseInt(cfg.paddingVertical, 10) : 12;
    var colorTexto = cfg.colorTexto || "#ffffff";
    var tamanoTexto = parseInt(cfg.tamanoTexto, 10) || 14;
    var colorAclaracion = cfg.colorAclaracion || "#9CA3AF";
    var tamanoAclaracion = parseInt(cfg.tamanoAclaracion, 10) || 12;
    var fondoCupon = cfg.fondoCupon || "#FEF08A";
    var textoCuponColor = cfg.textoCuponColor || "#854D0E";
    var tamanoCodigo = parseInt(cfg.tamanoCodigo, 10) || 15;
    var bordeRedondeadoCupon = parseInt(cfg.bordeRedondeadoCupon, 10) || 6;
    var estiloBordeCupon = cfg.estiloBordeCupon || "punteado";

    var fondoContador = cfg.fondoContador || "#374151";
    var textoContadorColor = cfg.textoContadorColor || "#F97516";
    var tamanoContador = parseInt(cfg.tamanoContador, 10) || 13;

    var campaignTheme = cfg.campaignTheme || "none";
    if (campaignTheme && campaignTheme !== "none") {
      if (campaignTheme === "black-friday") { colorFondo = "#000000"; colorTexto = "#ffffff"; fondoCupon = "#F59E0B"; textoCuponColor = "#111827"; }
      else if (campaignTheme === "hot-sale") { colorFondo = "#EF4444"; colorTexto = "#ffffff"; fondoCupon = "#ffffff"; textoCuponColor = "#EF4444"; }
      else if (campaignTheme === "cyber-monday") { colorFondo = "#1E3A8A"; colorTexto = "#ffffff"; fondoCupon = "#3B82F6"; textoCuponColor = "#ffffff"; }
      else if (campaignTheme === "navidad") { colorFondo = "#064E3B"; colorTexto = "#ffffff"; fondoCupon = "#10B981"; textoCuponColor = "#ffffff"; }
      else if (campaignTheme === "san-valentin") { colorFondo = "#831843"; colorTexto = "#ffffff"; fondoCupon = "#F472B6"; textoCuponColor = "#831843"; }
      else if (campaignTheme === "dia-padre-madre") { colorFondo = "#312E81"; colorTexto = "#ffffff"; fondoCupon = "#818CF8"; textoCuponColor = "#312E81"; }
      else if (campaignTheme === "liquidacion") { colorFondo = "#7F1D1D"; colorTexto = "#ffffff"; fondoCupon = "#FCA5A5"; textoCuponColor = "#7F1D1D"; }
    }

    var borderStyleCss = "none";
    if (estiloBordeCupon === "punteado") borderStyleCss = "2px dashed " + textoCuponColor;
    else if (estiloBordeCupon === "solido") borderStyleCss = "2px solid " + textoCuponColor;

    var positionStyle = isTop ? "top: 0 !important; bottom: auto !important;" : "bottom: 0 !important; top: auto !important;";

    var inject = function() {
      if (document.getElementById(uniqueId)) return;

      var container = document.createElement("div");
      container.id = uniqueId;
      container.setAttribute("data-nevux-widget", "barra-descuento");
      container.style.cssText = "position: fixed !important; left: 0 !important; right: 0 !important; width: 100% !important; z-index: 999999 !important; font-family: system-ui, -apple-system, sans-serif !important; box-sizing: border-box !important; " + positionStyle;

      var cssStyle = '<style>' +
        'html body #' + uniqueId + ' .nvx-bar-inner {' +
        '  background-color: ' + colorFondo + ' !important;' +
        '  color: ' + colorTexto + ' !important;' +
        '  padding: ' + paddingVertical + 'px 16px !important;' +
        '  display: flex !important;' +
        '  align-items: center !important;' +
        '  justify-content: center !important;' +
        '  gap: 12px !important;' +
        '  flex-wrap: wrap !important;' +
        '  position: relative !important;' +
        '  box-shadow: 0 ' + (isTop ? '4px' : '-4px') + ' 15px rgba(0,0,0,0.15) !important;' +
        '  box-sizing: border-box !important;' +
        '}' +
        'html body #' + uniqueId + ' .nvx-coupon-btn {' +
        '  background-color: ' + fondoCupon + ' !important;' +
        '  color: ' + textoCuponColor + ' !important;' +
        '  border: ' + borderStyleCss + ' !important;' +
        '  border-radius: ' + bordeRedondeadoCupon + 'px !important;' +
        '  padding: 4px 12px !important;' +
        '  font-weight: 800 !important;' +
        '  font-size: ' + tamanoCodigo + 'px !important;' +
        '  cursor: pointer !important;' +
        '  letter-spacing: 0.5px !important;' +
        '  transition: transform 0.15s ease !important;' +
        '  display: inline-flex !important;' +
        '  align-items: center !important;' +
        '  gap: 6px !important;' +
        '  user-select: none !important;' +
        '  position: relative !important;' +
        '}' +
        'html body #' + uniqueId + ' .nvx-coupon-btn:active {' +
        '  transform: scale(0.96) !important;' +
        '}' +
        'html body #' + uniqueId + ' .nvx-close-btn {' +
        '  position: absolute !important;' +
        '  right: 12px !important;' +
        '  top: 50% !important;' +
        '  transform: translateY(-50%) !important;' +
        '  background: transparent !important;' +
        '  border: none !important;' +
        '  color: ' + colorTexto + ' !important;' +
        '  font-size: 18px !important;' +
        '  cursor: pointer !important;' +
        '  opacity: 0.7 !important;' +
        '  padding: 4px 8px !important;' +
        '  line-height: 1 !important;' +
        '}' +
        'html body #' + uniqueId + ' .nvx-close-btn:hover {' +
        '  opacity: 1 !important;' +
        '}' +
        'html body #' + uniqueId + ' .nvx-copied-tooltip {' +
        '  position: absolute !important;' +
        '  bottom: calc(100% + 6px) !important;' +
        '  left: 50% !important;' +
        '  transform: translateX(-50%) !important;' +
        '  background: #10B981 !important;' +
        '  color: #ffffff !important;' +
        '  font-size: 11px !important;' +
        '  font-weight: 700 !important;' +
        '  padding: 3px 8px !important;' +
        '  border-radius: 4px !important;' +
        '  white-space: nowrap !important;' +
        '  opacity: 0 !important;' +
        '  pointer-events: none !important;' +
        '  transition: opacity 0.2s ease !important;' +
        '}' +
        'html body #' + uniqueId + ' .nvx-copied-tooltip.active {' +
        '  opacity: 1 !important;' +
        '}' +
        '@media (max-width: 640px) {' +
        '  html body #' + uniqueId + ' .nvx-bar-inner {' +
        '    padding-right: ' + (mostrarCerrar ? '36px' : '12px') + ' !important;' +
        '  }' +
        '}' +
        '</style>';

      var html = cssStyle + '<div class="nvx-bar-inner">';

      if (textoBarra) {
        html += '<span style="font-size: ' + tamanoTexto + 'px !important; font-weight: 600 !important; text-align: center !important;">' + textoBarra + '</span>';
      }

      if (codigoCupon) {
        html += '<button type="button" class="nvx-coupon-btn" id="' + uniqueId + '-btn">';
        html += '<span>' + codigoCupon + '</span>';
        html += '<span style="font-size: 11px !important; opacity: 0.8 !important;">📋</span>';
        html += '<span class="nvx-copied-tooltip" id="' + uniqueId + '-tooltip">¡Copiado!</span>';
        html += '</button>';
      }

      if (textoAclaracion) {
        html += '<span style="font-size: ' + tamanoAclaracion + 'px !important; color: ' + colorAclaracion + ' !important; text-align: center !important;">' + textoAclaracion + '</span>';
      }

      if (mostrarContador) {
        html += '<div style="background-color: ' + fondoContador + ' !important; color: ' + textoContadorColor + ' !important; padding: 3px 8px !important; border-radius: 4px !important; font-weight: 700 !important; font-size: ' + tamanoContador + 'px !important; display: inline-flex !important; align-items: center !important; gap: 4px !important;">';
        html += '<span>⏱️ Termina en:</span>';
        html += '<span id="' + uniqueId + '-timer">00:00:00</span>';
        html += '</div>';
      }

      if (mostrarCerrar) {
        html += '<button type="button" class="nvx-close-btn" id="' + uniqueId + '-close">✕</button>';
      }

      html += '</div>';
      container.innerHTML = html;

      document.body.appendChild(container);

      // Copia al portapapeles
      var btnEl = document.getElementById(uniqueId + "-btn");
      if (btnEl) {
        btnEl.addEventListener("click", function() {
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(codigoCupon);
            } else {
              var ta = document.createElement("textarea");
              ta.value = codigoCupon;
              document.body.appendChild(ta);
              ta.select();
              document.execCommand("copy");
              document.body.removeChild(ta);
            }
            var tooltip = document.getElementById(uniqueId + "-tooltip");
            if (tooltip) {
              tooltip.classList.add("active");
              setTimeout(function() {
                tooltip.classList.remove("active");
              }, 2000);
            }
          } catch (e) {}
        });
      }

      // Cierre de barra
      var closeEl = document.getElementById(uniqueId + "-close");
      if (closeEl) {
        closeEl.addEventListener("click", function() {
          if (window.sessionStorage) {
            window.sessionStorage.setItem(storageKeyClosed, "true");
          }
          container.style.display = "none";
        });
      }

      // Lógica de contador regresivo
      if (mostrarContador) {
        var storageKeyEnd = "nvx_discount_bar_endtime_" + (w.id || "default");
        var endTime = 0;
        if (window.sessionStorage) {
          endTime = parseInt(window.sessionStorage.getItem(storageKeyEnd), 10) || 0;
        }
        if (!endTime || endTime <= Date.now()) {
          endTime = Date.now() + (horasContador * 3600 + minutosContador * 60) * 1000;
          if (window.sessionStorage) {
            window.sessionStorage.setItem(storageKeyEnd, endTime.toString());
          }
        }

        var updateTimer = function() {
          var remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
          var h = Math.floor(remaining / 3600);
          var m = Math.floor((remaining % 3600) / 60);
          var s = remaining % 60;

          var pad = function(num) { return (num < 10 ? "0" : "") + num; };
          var timerEl = document.getElementById(uniqueId + "-timer");
          if (timerEl) {
            timerEl.textContent = pad(h) + ":" + pad(m) + ":" + pad(s);
          }
        };

        updateTimer();
        setInterval(updateTimer, 1000);
      }
    };

    inject();
  } catch (err) {
    if (window.console && window.console.warn) {
      window.console.warn("[Nevux] renderBarraDescuento error:", err);
    }
  }
}
      /* ═══════════════════════════════════════════
   WIDGET #48: MEDIOS DE PAGO (v2 — paridad editor)
   ═══════════════════════════════════════════ */
function renderMediosPago(w) {
  try {
    var pageType = typeof detectPageType === "function" ? detectPageType() : "";
    if (pageType !== "product") return;

    var cfg = w.config || {};
    if (typeof cfg === "string") {
      try { cfg = JSON.parse(cfg); } catch (e) { cfg = {}; }
    }

    var uniqueId = "nvx-medios-pago-" + (w.id || Math.random().toString(36).substring(7));

    /* ===== KEYS REALES DEL EDITOR ===== */
    var title = cfg.title !== undefined ? String(cfg.title) : "MEDIOS DE PAGO Y CUOTAS";
    var showInstallmentMessage = cfg.showInstallmentMessage !== false;
    var installmentText = cfg.installmentText !== undefined ? String(cfg.installmentText) : "Hasta 3 cuotas sin interés";
    var showSecureBadge = cfg.showSecureBadge !== false;
    var secureBadgeText = cfg.secureBadgeText !== undefined ? String(cfg.secureBadgeText) : "Pago 100% seguro";
    var activeMethods = cfg.activeMethods && cfg.activeMethods.length ? cfg.activeMethods : ["visa","mastercard","amex","naranjax","mercadopago","modo","uala","transferencia"];
    var customLogos = cfg.customLogos || [];
    var position = cfg.position || "before-add-to-cart";
    var alignment = cfg.alignment || "center";
    var bgColor = cfg.bgColor || "#ffffff";
    var textColor = cfg.textColor || "#111827";
    var accentColor = cfg.accentColor || "#10B981";
    var modoColorIconos = cfg.modoColorIconos || "original";
    var campaignTheme = cfg.campaignTheme || "none";

    /* ===== THEME_FX idéntico al editor ===== */
    var THEME_FX = {
      "black-friday":    { bg: "#111827", text: "#ffffff", accent: "#F59E0B", border: "1px solid #374151" },
      "hot-sale":        { bg: "#0F172A", text: "#ffffff", accent: "#EF4444", border: "1px solid #1E293B" },
      "cyber-monday":    { bg: "#090D16", text: "#ffffff", accent: "#3B82F6", border: "1px solid #1E3A8A" },
      "navidad":         { bg: "#064E3B", text: "#ffffff", accent: "#EF4444", border: "1px solid #047857" },
      "san-valentin":    { bg: "#FFF1F2", text: "#831843", accent: "#F43F5E", border: "1px solid #FECDD3" },
      "dia-padre-madre": { bg: "#EEF2FF", text: "#312E81", accent: "#6366F1", border: "1px solid #C7D2FE" },
      "liquidacion":     { bg: "#FEF2F2", text: "#7F1D1D", accent: "#F59E0B", border: "1px solid #FECACA" }
    };

    var borderCss = "1px solid #e5e7eb";
    if (campaignTheme && campaignTheme !== "none" && THEME_FX[campaignTheme]) {
      var t = THEME_FX[campaignTheme];
      bgColor = t.bg;
      textColor = t.text;
      accentColor = t.accent;
      borderCss = t.border;
    }

    /* ===== LOGOS SVG INLINE (paridad con editor) ===== */
    var filterCss = modoColorIconos === "grayscale" ? "filter: grayscale(100%) opacity(0.85);" : "";

    var LOGOS = {
      "visa": '<svg width="38" height="24" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#1A1F71"/><path d="M19.4 21.3h-2.6l1.6-10h2.6l-1.6 10zm9.5-9.8c-.5-.2-1.3-.4-2.4-.4-2.6 0-4.4 1.4-4.4 3.4 0 1.5 1.3 2.3 2.3 2.8 1 .5 1.4.9 1.4 1.3 0 .7-.8 1-1.6 1-1 0-1.7-.1-2.5-.5l-.4-.2-.4 2.3c.7.3 1.9.6 3.1.6 2.8 0 4.6-1.4 4.6-3.5 0-1.2-.7-2.1-2.3-2.8-.9-.5-1.5-.8-1.5-1.3 0-.4.5-.9 1.5-.9.9 0 1.6.2 2.1.4l.3.1.4-2.3zm6.6-.2h-2c-.6 0-1.1.2-1.4.8l-3.9 9.2h2.7s.4-1.3.5-1.5h3.3c.1.3.3 1.5.3 1.5h2.4l-2.1-10zm-3.3 6.4c.2-.6 1.1-2.9 1.1-2.9 0 .1.2-.6.4-1l.2.9s.4 2.2.5 2.9h-2.2zm-18.1-6.4l-2.6 6.8-.3-1.4c-.5-1.6-1.9-3.3-3.5-4.1l2.4 8.7h2.8l4.1-10h-2.9z" fill="#FFFFFF"/><path d="M11.3 11.3H7l-.1.3c3.4.8 5.6 2.9 6.6 5.3l-.9-4.7c-.2-.6-.6-.9-1.3-.9z" fill="#F7B600"/></svg>',
      "mastercard": '<svg width="38" height="24" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#16181D"/><circle cx="19" cy="16" r="8" fill="#EB001B"/><circle cx="29" cy="16" r="8" fill="#F79E1B"/><path d="M24 10a7.97 7.97 0 0 0-3 6.25 7.97 7.97 0 0 0 3 6.25 7.97 7.97 0 0 0 3-6.25A7.97 7.97 0 0 0 24 10z" fill="#FF5F00"/></svg>',
      "amex": '<svg width="38" height="24" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#1F72CD"/><text x="24" y="20" fill="#FFFFFF" font-size="9" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle" letter-spacing="1">AMEX</text></svg>',
      "cabal": '<svg width="38" height="24" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#003865"/><circle cx="18" cy="16" r="6" fill="#E30613"/><circle cx="27" cy="16" r="6" fill="#009639" fill-opacity="0.9"/><text x="24" y="29" fill="#FFFFFF" font-size="4" font-weight="700" font-family="Arial, sans-serif" text-anchor="middle">CABAL</text></svg>',
      "naranjax": '<svg width="38" height="24" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#FF6B00"/><text x="24" y="20" fill="#FFFFFF" font-size="11" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle">NX</text></svg>',
      "mercadopago": '<svg width="38" height="24" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#00B1EA"/><path d="M14 16c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="18.5" cy="16" r="1.2" fill="#FFCC33"/></svg>',
      "modo": '<svg width="38" height="24" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#000000"/><text x="24" y="20" fill="#00E599" font-size="10" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle">MODO</text></svg>',
      "uala": '<svg width="38" height="24" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#3545EE"/><text x="24" y="20" fill="#FFFFFF" font-size="11" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle">ualá</text></svg>',
      "gocuotas": '<svg width="38" height="24" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#00D084"/><text x="24" y="20" fill="#FFFFFF" font-size="9" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle">GO!</text></svg>',
      "pagonube": '<svg width="38" height="24" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#2B3445"/><text x="24" y="20" fill="#00C48C" font-size="7" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle">PagoNube</text></svg>',
      "pagofacil": '<svg width="38" height="24" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#FFE800"/><text x="24" y="20" fill="#003865" font-size="7" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle">Pago Fácil</text></svg>',
      "rapipago": '<svg width="38" height="24" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#0039A6"/><text x="24" y="20" fill="#FFDD00" font-size="8" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle">Rapipago</text></svg>',
      "transferencia": '<svg width="38" height="24" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="32" rx="4" fill="#10B981"/><path d="M24 8l-8 5h16l-8-5zm-7 7v7h2v-7h-2zm6 0v7h2v-7h-2zm6 0v7h2v-7h-2zm-13 8v2h18v-2H16z" fill="#FFFFFF"/></svg>'
    };

    /* ===== INJECT ===== */
    var inject = function () {
      if (document.getElementById(uniqueId)) return;

      var alignCss = alignment === "center" ? "center" : (alignment === "right" ? "right" : "left");
      var flexAlignCss = alignment === "center" ? "center" : (alignment === "right" ? "flex-end" : "flex-start");

      var container = document.createElement("div");
      container.id = uniqueId;
      container.setAttribute("data-nevux-widget", "medios-pago");
      container.style.cssText = "font-family: system-ui, -apple-system, sans-serif !important; margin: 16px 0 !important; padding: 20px !important; background-color: " + bgColor + " !important; color: " + textColor + " !important; border: " + borderCss + " !important; border-radius: 16px !important; box-sizing: border-box !important; text-align: " + alignCss + " !important; transition: all 0.3s ease !important;";

      var html = "";

      /* Header: Título + Badge seguro */
      html += '<div style="display: flex !important; align-items: center !important; justify-content: ' + flexAlignCss + ' !important; gap: 8px !important; margin-bottom: 10px !important; flex-wrap: wrap !important;">';
      if (title) {
        html += '<span style="font-size: 14px !important; font-weight: 800 !important; letter-spacing: 0.04em !important; text-transform: uppercase !important; color: ' + textColor + ' !important;">' + title + '</span>';
      }
      if (showSecureBadge && secureBadgeText) {
        html += '<span style="background: ' + accentColor + ' !important; color: #ffffff !important; font-size: 10px !important; font-weight: 800 !important; padding: 3px 8px !important; border-radius: 999px !important; display: inline-flex !important; align-items: center !important; gap: 4px !important;">🔒 ' + secureBadgeText + '</span>';
      }
      html += '</div>';

      /* Mensaje de cuotas */
      if (showInstallmentMessage && installmentText) {
        html += '<div style="background: rgba(16,185,129,0.1) !important; color: ' + accentColor + ' !important; border: 1px solid ' + accentColor + ' !important; border-radius: 8px !important; padding: 8px 12px !important; font-size: 12px !important; font-weight: 800 !important; margin-bottom: 14px !important; display: inline-block !important;">💳 ' + installmentText + '</div>';
      }

      /* Logos de pago */
      html += '<div style="display: flex !important; flex-wrap: wrap !important; gap: 8px !important; justify-content: ' + flexAlignCss + ' !important; margin-top: 6px !important;">';

      for (var i = 0; i < activeMethods.length; i++) {
        var mId = typeof activeMethods[i] === "string" ? activeMethods[i] : (activeMethods[i] && activeMethods[i].id ? activeMethods[i].id : "");
        if (mId && LOGOS[mId]) {
          html += '<div style="border-radius: 6px !important; overflow: hidden !important; box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important; display: flex !important; align-items: center !important; justify-content: center !important; ' + filterCss + '">' + LOGOS[mId] + '</div>';
        }
      }

      for (var j = 0; j < customLogos.length; j++) {
        var cl = customLogos[j];
        var clUrl = cl && (cl.url || cl.logoUrl) ? (cl.url || cl.logoUrl) : null;
        if (clUrl) {
          html += '<div style="width: 38px !important; height: 24px !important; border-radius: 6px !important; overflow: hidden !important; border: 1px solid #e5e7eb !important; background: #ffffff !important; display: flex !important; align-items: center !important; justify-content: center !important; ' + filterCss + '"><img src="' + clUrl + '" alt="' + (cl.name || "Medio de pago") + '" style="width: 100% !important; height: 100% !important; object-fit: contain !important;" /></div>';
        }
      }

      html += '</div>';

      container.innerHTML = html;

      /* ===== POSICIONAMIENTO DOM ===== */
      var findDescriptionEl = function () {
        return document.querySelector(".js-product-description") ||
               document.querySelector(".product-description") ||
               document.querySelector("#product-description") ||
               document.querySelector("[data-store='product-description']") ||
               document.querySelector(".user-content") ||
               document.querySelector(".description");
      };

      var findAtcForm = function () {
        return document.querySelector("form[action*='/cart/add']") ||
               document.querySelector("form.js-product-form") ||
               document.querySelector(".js-product-container") ||
               document.querySelector(".product-buy-container");
      };

      var placed = false;

      if (position === "before-description") {
        var descEl = findDescriptionEl();
        if (descEl && descEl.parentNode) {
          descEl.parentNode.insertBefore(container, descEl);
          placed = true;
        }
      } else if (position === "after-add-to-cart") {
        var atcAfter = findAtcForm();
        if (atcAfter && atcAfter.parentNode) {
          atcAfter.parentNode.insertBefore(container, atcAfter.nextSibling);
          placed = true;
        }
      } else {
        /* before-add-to-cart (default) */
        var atcBefore = findAtcForm();
        if (atcBefore && atcBefore.parentNode) {
          atcBefore.parentNode.insertBefore(container, atcBefore);
          placed = true;
        }
      }

      if (!placed) {
        var fallback = document.querySelector("form[action*='/cart/add']") || document.querySelector("main");
        if (fallback && fallback.parentNode) {
          fallback.parentNode.insertBefore(container, fallback);
        } else {
          document.body.appendChild(container);
        }
      }

      if (typeof nvxTrack === "function") {
        try { nvxTrack("medios-pago", "render", { position: position, campaignTheme: campaignTheme }); } catch (e) {}
      }
    };

    inject();
    setTimeout(function () { if (!document.getElementById(uniqueId)) inject(); }, 500);
    setTimeout(function () { if (!document.getElementById(uniqueId)) inject(); }, 1500);

  } catch (err) {
    if (window.console && window.console.warn) {
      window.console.warn("[Nevux] renderMediosPago error:", err);
    }
  }
      }
/* ═══════════════════════════════════════════
   WIDGET #49: FAVORITOS (v401 — CIERRE AUTOMÁTICO + CARRITO OK)
   ═══════════════════════════════════════════ */
function renderFavoritos(w) {
  try {
    var cfg = w.config || {};
    if (typeof cfg === "string") {
      try { cfg = JSON.parse(cfg); } catch (e) { cfg = {}; }
    }

    var uniqueId = "nvx-favoritos-" + (w.id || "global");
    if (document.getElementById(uniqueId + "-root")) return;

    /* ===== KEYS REALES DEL EDITOR ===== */
    var iconType = cfg.iconType || "heart";
    var modalTitle = cfg.modalTitle !== undefined ? String(cfg.modalTitle) : "Mis favoritos";
    var showInGrids = cfg.showInGrids !== false;
    var badgePositionImage = cfg.badgePositionImage || "top-right";
    var floatingPosition = cfg.floatingPosition || "bottom-right";
    var accentColor = cfg.accentColor || "#e11d48";
    var bgColor = cfg.bgColor || "#ffffff";
    var hasShadow = cfg.hasShadow !== false;
    var borderRadius = cfg.borderRadius !== undefined ? cfg.borderRadius : "50%";
    var floatingButtonSize = cfg.floatingButtonSize !== undefined ? cfg.floatingButtonSize : "55px";
    var floatingIconSize = cfg.floatingIconSize !== undefined ? cfg.floatingIconSize : "24px";
    var showAddToCart = cfg.showAddToCart !== false;

    var brCss = (typeof borderRadius === "number") ? (borderRadius + "px") : String(borderRadius);
    var btnSizeCss = (typeof floatingButtonSize === "number") ? (floatingButtonSize + "px") : String(floatingButtonSize);
    var iconSizeNum = (typeof floatingIconSize === "number") ? floatingIconSize : (parseInt(String(floatingIconSize), 10) || 24);
    var shadowFabCss = hasShadow ? "0 8px 24px rgba(0,0,0,0.18)" : "0 1px 3px rgba(0,0,0,0.08)";
    var shadowPanelCss = "0 20px 50px rgba(0,0,0,0.25)";

    var STORAGE_KEY = "nvx_favoritos_" + (w.store_id || w.storeId || "default");

    function getFavs() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        var arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
      } catch (e) {
        return [];
      }
    }

    function setFavs(arr) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr || []));
      } catch (e) {}
      updateUI();
    }

    function isFav(id) {
      var favs = getFavs();
      for (var i = 0; i < favs.length; i++) {
        if (String(favs[i].id) === String(id)) return true;
      }
      return false;
    }

    function toggleFav(item) {
      if (!item || !item.id) return;
      var favs = getFavs();
      var found = -1;
      for (var i = 0; i < favs.length; i++) {
        if (String(favs[i].id) === String(item.id)) { found = i; break; }
      }
      if (found >= 0) {
        favs.splice(found, 1);
      } else {
        favs.push({
          id: String(item.id),
          variantId: String(item.variantId || item.id),
          name: item.name || "Producto",
          price: item.price || "",
          image: item.image || "",
          url: item.url || window.location.href
        });
      }
      setFavs(favs);
      if (typeof nvxTrack === "function") {
        try { nvxTrack("favoritos", found >= 0 ? "remove" : "add", { product_id: item.id }); } catch (e) {}
      }
    }

    function iconSvg(filled, size, color) {
      var s = size || 20;
      var c = color || accentColor;
      if (iconType === "star") {
        return filled
          ? '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="' + c + '" xmlns="http://www.w3.org/2000/svg"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
          : '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="' + c + '" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      }
      if (iconType === "bookmark") {
        return filled
          ? '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="' + c + '" xmlns="http://www.w3.org/2000/svg"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>'
          : '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="' + c + '" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
      }
      return filled
        ? '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="' + c + '" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
        : '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="' + c + '" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    }

    function badgePosCss() {
      if (badgePositionImage === "top-left") return "top:10px;left:10px;";
      if (badgePositionImage === "bottom-left") return "bottom:10px;left:10px;";
      if (badgePositionImage === "bottom-right") return "bottom:10px;right:10px;";
      return "top:10px;right:10px;";
    }

    function floatingPosCss() {
      var base = "position:fixed !important;z-index:99997 !important;";
      if (floatingPosition === "bottom-left") return base + "bottom:20px !important;left:20px !important;right:auto !important;top:auto !important;";
      if (floatingPosition === "top-right") return base + "top:20px !important;right:20px !important;left:auto !important;bottom:auto !important;";
      if (floatingPosition === "top-left") return base + "top:20px !important;left:20px !important;right:auto !important;bottom:auto !important;";
      if (floatingPosition === "mid-right" || floatingPosition === "center-right") return base + "top:50% !important;right:20px !important;left:auto !important;bottom:auto !important;transform:translateY(-50%) !important;";
      if (floatingPosition === "mid-left" || floatingPosition === "center-left") return base + "top:50% !important;left:20px !important;right:auto !important;bottom:auto !important;transform:translateY(-50%) !important;";
      return base + "bottom:20px !important;right:20px !important;left:auto !important;top:auto !important;";
    }

    function extractProductFromCard(card) {
      if (!card) return null;
      var link = card.querySelector("a[href*='/productos/'], a[href*='/products/'], a.item-link, a.js-item-link, a[itemprop='url']") || card.closest("a") || card.querySelector("a");
      var href = link ? (link.getAttribute("href") || "") : "";
      var nameEl = card.querySelector(".item-name, .js-item-name, [itemprop='name'], .product-title, h2, h3");
      var priceEl = card.querySelector(".item-price, .js-price-display, [itemprop='price'], .price, .product-price");
      var imgEl = card.querySelector("img");
      var id = card.getAttribute("data-product-id") ||
               card.getAttribute("data-productid") ||
               (card.id ? String(card.id).replace(/\D/g, "") : "") ||
               href;
      if (!id && href) id = href;
      if (!id) return null;
      return {
        id: String(id),
        variantId: String(id),
        name: nameEl ? (nameEl.textContent || "").trim() : "Producto",
        price: priceEl ? (priceEl.textContent || "").trim() : "",
        image: imgEl ? (imgEl.getAttribute("src") || imgEl.getAttribute("data-src") || "") : "",
        url: href || window.location.href
      };
    }

    function extractCurrentProduct() {
      var nameEl = document.querySelector("h1.js-product-name, h1[itemprop='name'], h1.product-title, h1");
      var priceEl = document.querySelector(".js-price-display, [itemprop='price'], .product-price, #price_display");
      var imgEl = document.querySelector(".js-product-image img, .product-image img, [data-store='product-image'] img, meta[property='og:image'], .product-gallery img");
      var variantInput = document.querySelector("input[name='add_to_cart']");
      var variantId = variantInput ? variantInput.value : "";

      var id = (window.LS && window.LS.product && (window.LS.product.id || window.LS.product.id_product)) ||
               variantId ||
               (document.querySelector("[data-product-id]") && document.querySelector("[data-product-id]").getAttribute("data-product-id")) ||
               window.location.pathname;

      var image = "";
      if (imgEl) {
        image = imgEl.getAttribute("content") || imgEl.getAttribute("src") || imgEl.getAttribute("data-src") || "";
      }
      return {
        id: String(id || window.location.pathname),
        variantId: String(variantId || id || window.location.pathname),
        name: nameEl ? (nameEl.textContent || "").trim() : "Producto",
        price: priceEl ? (priceEl.textContent || "").trim() : "",
        image: image,
        url: window.location.href
      };
    }

    function makeBadgeButton(item, size) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nvx-fav-badge";
      btn.setAttribute("data-nvx-fav-id", String(item.id));
      btn.setAttribute("aria-label", "Favorito");
      var filled = isFav(item.id);
      btn.innerHTML = iconSvg(filled, size || 16, filled ? accentColor : "#6B7280");
      btn.style.cssText = "position:absolute !important;" + badgePosCss() + "width:34px !important;height:34px !important;border-radius:50% !important;background:#ffffff !important;border:none !important;box-shadow:0 2px 8px rgba(0,0,0,0.18) !important;display:flex !important;align-items:center !important;justify-content:center !important;cursor:pointer !important;z-index:25 !important;padding:0 !important;line-height:1 !important;transition:transform 0.15s ease !important;";
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        toggleFav(item);
      });
      return btn;
    }

    function injectBadges() {
      var galleries = document.querySelectorAll(
        ".js-product-slides, .js-product-gallery, .product-image, [data-store='product-image'], [data-store='product-gallery'], .product-gallery, .product-gallery__image, .swiper-slide-active, .js-swiper-product-page, .js-product-slide, .gallery-image, .js-product-image"
      );
      if (galleries.length > 0) {
        var product = extractCurrentProduct();
        for (var g = 0; g < galleries.length; g++) {
          var gal = galleries[g];
          if (gal.querySelector(".nvx-fav-badge")) continue;
          var cs = window.getComputedStyle(gal);
          if (cs.position === "static") gal.style.position = "relative";
          gal.appendChild(makeBadgeButton(product, 18));
        }
      }

      if (showInGrids) {
        var cards = document.querySelectorAll(
          ".js-item-product, .item-product, .product-item, [data-product-id], .js-product-container .item, .product-grid .item, li.item, article.product, .js-item-container"
        );
        for (var i = 0; i < cards.length; i++) {
          var card = cards[i];
          if (card.querySelector(".nvx-fav-badge")) continue;
          var item = extractProductFromCard(card);
          if (!item) continue;
          var imgWrap = card.querySelector(".js-item-image, .item-image, .product-image, figure, .image-container, a") || card;
          var cs2 = window.getComputedStyle(imgWrap);
          if (cs2.position === "static") imgWrap.style.position = "relative";
          imgWrap.appendChild(makeBadgeButton(item, 16));
        }
      }
    }

    function updateBadgesState() {
      var badges = document.querySelectorAll(".nvx-fav-badge");
      for (var i = 0; i < badges.length; i++) {
        var id = badges[i].getAttribute("data-nvx-fav-id");
        var filled = isFav(id);
        badges[i].innerHTML = iconSvg(filled, 16, filled ? accentColor : "#6B7280");
      }
    }

    /* ═══ CIERRE + REFRESH DEL CARRITO ═══ */
    function finishAndClose() {
      closePanel();
      setTimeout(function () {
        if (window.nube && typeof window.nube.send === "function") {
          try { window.nube.send("cart:open"); } catch (e) {}
          setTimeout(function () { window.location.reload(); }, 500);
        } else {
          window.location.reload();
        }
      }, 250);
    }

    /* ═══ AGREGAR 1 PRODUCTO AL CARRITO ═══ */
    function addToCartSingle(item, btnEl) {
      var targetId = item.variantId || item.id;
      if (!targetId || String(targetId).indexOf('/') !== -1) {
        if (item.url) window.location.href = item.url;
        return;
      }

      if (btnEl) {
        btnEl.disabled = true;
        btnEl.innerHTML = "&#8987;";
        btnEl.style.opacity = "0.7";
      }

      var remaining = getFavs().filter(function (x) { return String(x.id) !== String(item.id); });

      function onDone() {
        if (typeof nvxTrack === "function") {
          try { nvxTrack("favoritos", "add_to_cart_click", { product_id: item.id }); } catch (e) {}
        }
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining)); } catch (e) {}
        if (btnEl) {
          btnEl.style.background = "#10B981";
          btnEl.innerHTML = "&#10003;";
        }
        setTimeout(finishAndClose, 400);
      }

      /* MÉTODO 1: NubeSDK (vía oficial Tiendanube) */
      if (window.nube && typeof window.nube.send === "function") {
        try {
          window.nube.send("cart:add", { variantId: String(targetId), quantity: 1 });
          setTimeout(onDone, 700);
          return;
        } catch (e) {}
      }

      /* MÉTODO 2: POST /comprar/ (fallback oficial legacy) */
      var fd1 = new FormData();
      fd1.append("add_to_cart", String(targetId));
      fd1.append("quantity", "1");

      fetch("/comprar/", {
        method: "POST",
        body: fd1,
        credentials: "include",
        headers: { "X-Requested-With": "XMLHttpRequest" }
      }).then(function () {
        onDone();
      })["catch"](function () {
        /* MÉTODO 3: /carrito/agregar/ como último recurso */
        var fd2 = new FormData();
        fd2.append("add_to_cart", String(targetId));
        fd2.append("quantity", "1");
        fetch("/carrito/agregar/", {
          method: "POST",
          body: fd2,
          credentials: "include",
          headers: { "X-Requested-With": "XMLHttpRequest" }
        }).then(function () { onDone(); })["catch"](function () { onDone(); });
      });
    }

    /* ═══ AGREGAR TODOS LOS FAVORITOS ═══ */
    function addAllToCart() {
      var favs = getFavs();
      if (!favs.length) return;
      var btn = document.getElementById(uniqueId + "-add-all");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = "Agregando...";
        btn.style.opacity = "0.7";
      }

      var idx = 0;

      function addOne(f, done) {
        var tid = f.variantId || f.id;
        if (!tid || String(tid).indexOf('/') !== -1) {
          done();
          return;
        }

        if (window.nube && typeof window.nube.send === "function") {
          try {
            window.nube.send("cart:add", { variantId: String(tid), quantity: 1 });
            setTimeout(done, 550);
            return;
          } catch (e) {}
        }

        var fdA = new FormData();
        fdA.append("add_to_cart", String(tid));
        fdA.append("quantity", "1");

        fetch("/comprar/", {
          method: "POST",
          body: fdA,
          credentials: "include",
          headers: { "X-Requested-With": "XMLHttpRequest" }
        }).then(function () { done(); })["catch"](function () {
          var fdB = new FormData();
          fdB.append("add_to_cart", String(tid));
          fdB.append("quantity", "1");
          fetch("/carrito/agregar/", {
            method: "POST",
            body: fdB,
            credentials: "include",
            headers: { "X-Requested-With": "XMLHttpRequest" }
          }).then(function () { done(); })["catch"](function () { done(); });
        });
      }

      function next() {
        if (idx >= favs.length) {
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify([])); } catch (e) {}
          if (typeof nvxTrack === "function") {
            try { nvxTrack("favoritos", "add_all_to_cart", { count: favs.length }); } catch (e) {}
          }
          finishAndClose();
          return;
        }
        var f = favs[idx++];
        addOne(f, next);
      }
      next();
    }

    function updateUI() {
      var favs = getFavs();
      var countEl = document.getElementById(uniqueId + "-count");
      if (countEl) {
        countEl.textContent = String(favs.length);
        countEl.style.display = favs.length > 0 ? "flex" : "none";
      }

      var addAllBtn = document.getElementById(uniqueId + "-add-all");
      if (addAllBtn) {
        addAllBtn.style.display = (showAddToCart && favs.length > 0) ? "inline-flex" : "none";
      }

      var listEl = document.getElementById(uniqueId + "-list");
      if (listEl) renderList(listEl, favs);
      updateBadgesState();
    }

    function renderList(listEl, favs) {
      if (!favs.length) {
        listEl.innerHTML = '<div style="padding:40px 20px !important;text-align:center !important;color:#6B7280 !important;font-size:14px !important;font-weight:500 !important;">Todav&iacute;a no guardaste productos.</div>';
        return;
      }
      var html = "";
      for (var i = 0; i < favs.length; i++) {
        var f = favs[i];
        html += '<div style="display:flex !important;gap:12px !important;align-items:center !important;background:#ffffff !important;padding:10px !important;border-radius:10px !important;margin-bottom:8px !important;border:1px solid #f3f4f6 !important;">';
        html += '<div style="width:50px !important;height:50px !important;border-radius:8px !important;overflow:hidden !important;background:#f3f4f6 !important;flex-shrink:0 !important;">';
        if (f.image) {
          html += '<img src="' + f.image + '" alt="" style="width:100% !important;height:100% !important;object-fit:cover !important;display:block !important;" />';
        }
        html += '</div>';
        html += '<div style="flex:1 !important;min-width:0 !important;">';
        html += '<a href="' + (f.url || "#") + '" style="font-size:13px !important;font-weight:700 !important;color:#111827 !important;text-decoration:none !important;display:-webkit-box !important;-webkit-line-clamp:2 !important;-webkit-box-orient:vertical !important;overflow:hidden !important;line-height:1.3 !important;">' + (f.name || "Producto") + '</a>';
        if (f.price) {
          html += '<div style="font-size:13px !important;font-weight:800 !important;color:' + accentColor + ' !important;margin-top:4px !important;">' + f.price + '</div>';
        }
        html += '</div>';
        if (showAddToCart) {
          html += '<button type="button" class="nvx-fav-atc" data-idx="' + i + '" style="width:34px !important;height:34px !important;border-radius:50% !important;background:' + accentColor + ' !important;color:#ffffff !important;border:none !important;font-size:18px !important;font-weight:800 !important;cursor:pointer !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-shrink:0 !important;line-height:1 !important;padding:0 !important;" aria-label="Agregar al carrito">+</button>';
        }
        html += '<button type="button" class="nvx-fav-remove" data-id="' + f.id + '" style="background:none !important;border:none !important;color:#9ca3af !important;font-size:16px !important;font-weight:700 !important;cursor:pointer !important;padding:4px 6px !important;line-height:1 !important;margin-left:2px !important;" aria-label="Quitar">&#10005;</button>';
        html += '</div>';
      }
      listEl.innerHTML = html;

      var removes = listEl.querySelectorAll(".nvx-fav-remove");
      for (var r = 0; r < removes.length; r++) {
        removes[r].addEventListener("click", function (ev) {
          var id = ev.currentTarget.getAttribute("data-id");
          var nextFavs = getFavs().filter(function (x) { return String(x.id) !== String(id); });
          setFavs(nextFavs);
        });
      }

      if (showAddToCart) {
        var atcBtns = listEl.querySelectorAll(".nvx-fav-atc");
        for (var a = 0; a < atcBtns.length; a++) {
          atcBtns[a].addEventListener("click", function (ev) {
            var idx = parseInt(ev.currentTarget.getAttribute("data-idx"), 10);
            var items = getFavs();
            if (items[idx]) {
              addToCartSingle(items[idx], ev.currentTarget);
            }
          });
        }
      }
    }

    function openPanel() {
      var panel = document.getElementById(uniqueId + "-panel");
      var overlay = document.getElementById(uniqueId + "-overlay");
      if (panel) panel.style.display = "flex";
      if (overlay) overlay.style.display = "block";
      updateUI();
      if (typeof nvxTrack === "function") {
        try { nvxTrack("favoritos", "open_panel", { count: getFavs().length }); } catch (e) {}
      }
    }

    function closePanel() {
      var panel = document.getElementById(uniqueId + "-panel");
      var overlay = document.getElementById(uniqueId + "-overlay");
      if (panel) panel.style.display = "none";
      if (overlay) overlay.style.display = "none";
    }

    function buildRoot() {
      /* OVERLAY */
      var overlay = document.createElement("div");
      overlay.id = uniqueId + "-overlay";
      overlay.style.cssText = "display:none;position:fixed !important;top:0 !important;left:0 !important;right:0 !important;bottom:0 !important;background:rgba(17,24,39,0.5) !important;z-index:99996 !important;";
      overlay.addEventListener("click", closePanel);
      document.body.appendChild(overlay);

      /* FAB FLOTANTE */
      var fab = document.createElement("button");
      fab.type = "button";
      fab.id = uniqueId + "-fab";
      fab.setAttribute("aria-label", modalTitle);
      fab.style.cssText = floatingPosCss() + "width:" + btnSizeCss + " !important;height:" + btnSizeCss + " !important;border-radius:" + brCss + " !important;background:" + bgColor + " !important;border:1px solid #e5e7eb !important;box-shadow:" + shadowFabCss + " !important;display:flex !important;align-items:center !important;justify-content:center !important;cursor:pointer !important;padding:0 !important;margin:0 !important;";
      fab.innerHTML = '<span style="display:flex;align-items:center;justify-content:center;position:relative;">' +
        iconSvg(true, iconSizeNum, accentColor) +
        '<span id="' + uniqueId + '-count" style="display:none;position:absolute;top:-10px;right:-10px;min-width:20px;height:20px;border-radius:999px;background:' + accentColor + ';color:#ffffff;font-size:11px;font-weight:800;align-items:center;justify-content:center;padding:0 5px;box-sizing:border-box;border:2px solid #ffffff;line-height:1;">0</span>' +
        '</span>';
      fab.addEventListener("click", function (ev) {
        ev.preventDefault();
        openPanel();
      });
      document.body.appendChild(fab);

      /* PANEL MODAL */
      var panel = document.createElement("div");
      panel.id = uniqueId + "-panel";
      panel.style.cssText = "display:none;position:fixed !important;top:50% !important;left:50% !important;transform:translate(-50%,-50%) !important;width:min(380px,calc(100vw - 32px)) !important;max-height:min(560px,calc(100vh - 40px)) !important;background:#ffffff !important;border-radius:16px !important;box-shadow:" + shadowPanelCss + " !important;border:1px solid #e5e7eb !important;z-index:99998 !important;flex-direction:column !important;overflow:hidden !important;font-family:system-ui,-apple-system,sans-serif !important;";

      var header = document.createElement("div");
      header.style.cssText = "display:flex !important;align-items:center !important;justify-content:space-between !important;padding:14px 16px !important;border-bottom:1px solid #f3f4f6 !important;gap:8px !important;";

      var headerLeft = document.createElement("div");
      headerLeft.style.cssText = "display:flex !important;align-items:center !important;gap:8px !important;flex:1 !important;min-width:0 !important;";
      headerLeft.innerHTML = iconSvg(true, 18, accentColor) + '<span style="font-size:15px !important;font-weight:800 !important;color:#111827 !important;white-space:nowrap !important;overflow:hidden !important;text-overflow:ellipsis !important;">' + modalTitle + '</span>';

      var headerRight = document.createElement("div");
      headerRight.style.cssText = "display:flex !important;align-items:center !important;gap:6px !important;flex-shrink:0 !important;";

      var addAllBtn = document.createElement("button");
      addAllBtn.type = "button";
      addAllBtn.id = uniqueId + "-add-all";
      addAllBtn.style.cssText = "display:none;align-items:center !important;gap:4px !important;padding:7px 11px !important;border-radius:8px !important;background:" + accentColor + " !important;color:#ffffff !important;font-size:12px !important;font-weight:700 !important;border:none !important;cursor:pointer !important;line-height:1 !important;white-space:nowrap !important;";
      addAllBtn.innerHTML = '&#128717; Agregar todos';
      addAllBtn.addEventListener("click", addAllToCart);

      var closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.id = uniqueId + "-close";
      closeBtn.style.cssText = "background:none !important;border:none !important;font-size:20px !important;font-weight:800 !important;color:#6B7280 !important;cursor:pointer !important;line-height:1 !important;padding:4px 8px !important;";
      closeBtn.innerHTML = "&#10005;";
      closeBtn.addEventListener("click", closePanel);

      headerRight.appendChild(addAllBtn);
      headerRight.appendChild(closeBtn);
      header.appendChild(headerLeft);
      header.appendChild(headerRight);

      var list = document.createElement("div");
      list.id = uniqueId + "-list";
      list.style.cssText = "padding:12px 14px !important;overflow-y:auto !important;flex:1 !important;background:#fafafa !important;";

      panel.appendChild(header);
      panel.appendChild(list);
      document.body.appendChild(panel);

      var root = document.createElement("div");
      root.id = uniqueId + "-root";
      root.setAttribute("data-nevux-widget", "favoritos");
      root.style.cssText = "display:none !important;";
      document.body.appendChild(root);
    }

    /* ===== BOOT ===== */
    buildRoot();
    injectBadges();
    updateUI();

    setTimeout(function () { injectBadges(); updateUI(); }, 600);
    setTimeout(function () { injectBadges(); updateUI(); }, 1600);
    setTimeout(function () { injectBadges(); updateUI(); }, 3200);

    try {
      var mo = new MutationObserver(function () {
        injectBadges();
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}

    if (typeof nvxTrack === "function") {
      try { nvxTrack("favoritos", "render", { showInGrids: showInGrids, floatingPosition: floatingPosition }); } catch (e) {}
    }

  } catch (err) {
    if (window.console && window.console.warn) {
      window.console.warn("[Nevux] renderFavoritos error:", err);
    }
  }
          }
})(); 
