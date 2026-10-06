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

  fetch(url)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      // 🌟 INYECCIÓN DE EFECTOS ATMOSFÉRICOS SI HAY CAMPAÑA ACTIVA
      if (data.activeCampaign) {
        renderAtmosphericEffects(data.activeCampaign);
      }

      // 🎙️ INYECCIÓN UNIFICADA DE BÚSQUEDA POR VOZ
      if (data.voiceSearch && data.voiceSearch.is_active) {
        if (document.body) {
          renderNevuxVoiceUI(data.voiceSearch);
        } else {
          document.addEventListener("DOMContentLoaded", function() {
            renderNevuxVoiceUI(data.voiceSearch);
          });
        }
      }

      // 🤖 INYECCIÓN UNIFICADA DE VENDEDOR VIRTUAL IA
      if (data.virtualSalesman && data.virtualSalesman.is_active) {
        if (document.body) {
          renderNevuxSalesmanUI(data.virtualSalesman);
        } else {
          document.addEventListener("DOMContentLoaded", function() {
            renderNevuxSalesmanUI(data.virtualSalesman);
          });
        }
      }

      // 🔥 INYECCIÓN UNIFICADA DE SOCIAL PROOF IA
      if (data.socialProof && data.socialProof.is_active) {
        if (document.body) {
          renderSocialProof(data.socialProof);
        } else {
          document.addEventListener("DOMContentLoaded", function() {
            renderSocialProof(data.socialProof);
          });
        }
      }

            if (!data.widgets || data.widgets.length === 0) {
        console.log("[Nevux] No hay widgets activos");
        return;
      }
      console.log("[Nevux] Widgets recibidos:", data.widgets.length);
      data.widgets.forEach(function (w) {
        try {
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
        } catch (err) {
          console.error("[Nevux] Error renderizando widget:", w.widget_slug, err);
        }
      });
    })
    .catch(function (err) {
      console.error("[Nevux] Error cargando widgets:", err);
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
    // 🎯 UBICACIÓN EXACTA ARRIBA DEL BANNER PRINCIPAL DE LA HOME
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
   WIDGET: HORARIO DE ATENCIÓN
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
  container.style.cssText = 'background:' + bgColor + ';border:1.5px solid ' + borderColor + ';border-radius:12px;padding:14px 18px;margin:12px 0;box-sizing:border-box;box-shadow:0 3px 10px rgba(0,0,0,0.03);display:flex;align-items:center;gap:12px;font-family:system-ui,-apple-system,sans-serif;color:' + textColor + ';';

  var iconHtml = showIcon ? '<div style="font-size:26px;line-height:1;flex-shrink:0;">⏰</div>' : '';
  var statusBadge = isOpen
    ? '<span style="background:#ecfdf5;color:#059669;font-size:10px;font-weight:900;padding:2px 7px;border-radius:999px;display:inline-flex;align-items:center;gap:4px;margin-bottom:4px;"><span style="width:6px;height:6px;border-radius:50%;background:#10B981;display:inline-block;"></span>ABIERTO AHORA</span>'
    : '<span style="background:#fef2f2;color:#dc2626;font-size:10px;font-weight:900;padding:2px 7px;border-radius:999px;display:inline-flex;align-items:center;gap:4px;margin-bottom:4px;"><span style="width:6px;height:6px;border-radius:50%;background:#ef4444;display:inline-block;"></span>CERRADO</span>';

  var mainMsg = isOpen ? openText : closedText;

  container.innerHTML = iconHtml +
    '<div style="flex:1;min-width:0;">' +
      '<div>' + statusBadge + '</div>' +
      '<div style="font-size:13px;font-weight:800;line-height:1.3;margin-bottom:3px;">' + mainMsg + '</div>' +
      '<div style="font-size:11px;opacity:0.65;font-weight:600;">Atención: Lun a Vie ' + openTime + ' a ' + closeTime + ' hs.</div>' +
    '</div>';

  // Inserción en el DOM
  var targetEl = null;
  if (w.target_type === 'product' && w.target_product_id) {
    targetEl = document.querySelector('form[action*="/cart/add"], .js-product-form, .js-product-container, form.js-product-buyform');
    if (targetEl && targetEl.parentNode) {
      targetEl.parentNode.insertBefore(container, targetEl);
    }
  } else {
    var main = document.querySelector('main, #content, .main-content, .js-main-content');
    if (main) {
      main.insertBefore(container, main.firstChild);
    } else {
      var body = document.body;
      if (body) body.insertBefore(container, body.firstChild);
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
     SOCIAL PROOF IA — NOTIFICACIONES COMPACTAS PRO (v235)
  ═══════════════════════════════════════════ */
  function renderSocialProof(spData) {
    if (!spData || !spData.is_active || !Array.isArray(spData.events) || spData.events.length === 0) return;

    var nsPrefix = typeof NS !== "undefined" ? NS : "nvx";
    var rootId = nsPrefix + "-social-proof-root";
    
    var existingContainer = document.getElementById(rootId);
    if (existingContainer && existingContainer.parentNode) {
      existingContainer.parentNode.removeChild(existingContainer);
    }

    var container = document.createElement("div");
    container.id = rootId;
    container.className = nsPrefix + "-root";

    var pos = spData.position || "bottom-left";
    var posStyles = "position:fixed !important;z-index:999995 !important;max-width:250px !important;width:calc(100% - 32px) !important;pointer-events:none !important;display:block !important;box-sizing:border-box !important;";
    
    if (pos.indexOf("bottom") !== -1) posStyles += "bottom:14px !important;";
    if (pos.indexOf("top") !== -1) posStyles += "top:14px !important;";
    if (pos.indexOf("left") !== -1) posStyles += "left:14px !important;";
    if (pos.indexOf("right") !== -1) posStyles += "right:14px !important;";

    container.style.cssText = posStyles;

    if (document.body) {
      document.body.appendChild(container);
    } else {
      return;
    }

    var currentIdx = 0;
    var displayMs = (spData.display_duration || 5) * 1000;
    var delayMs = (spData.delay_between || 8) * 1000;
    var theme = spData.theme_style || "light";

    function safeEscape(str) {
      if (!str) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function showNextEvent() {
      if (!spData.events || spData.events.length === 0) return;
      var ev = spData.events[currentIdx];
      currentIdx = (currentIdx + 1) % spData.events.length;

      var bgStyle = "#ffffff";
      var textColor = "#111827";
      var subColor = "#6b7280";
      var borderStyle = "1px solid #e5e7eb";
      var backdrop = "";

      if (theme === "dark") {
        bgStyle = "#111827";
        textColor = "#ffffff";
        subColor = "#9ca3af";
        borderStyle = "1px solid #374151";
      } else if (theme === "glass") {
        bgStyle = "rgba(255, 255, 255, 0.94)";
        textColor = "#111827";
        subColor = "#4b5563";
        borderStyle = "1px solid rgba(255, 255, 255, 0.7)";
        backdrop = "backdrop-filter:blur(10px) !important;-webkit-backdrop-filter:blur(10px) !important;";
      }

      var cardId = nsPrefix + "-sp-card";
      var closeId = nsPrefix + "-sp-close";

      var imgHtml = ev.productImage
        ? '<img src="' + safeEscape(ev.productImage) + '" style="width:34px !important;height:34px !important;object-fit:cover !important;border-radius:8px !important;border:' + borderStyle + ' !important;flex-shrink:0 !important;display:block !important;" />'
        : '<div style="width:34px !important;height:34px !important;border-radius:8px !important;background:' + (theme === "dark" ? "#1f2937" : "#f3f4f6") + ' !important;display:flex !important;align-items:center !important;justify-content:center !important;font-size:16px !important;flex-shrink:0 !important;">' + (ev.icon || "🛒") + '</div>';

      var cardHtml = '<div id="' + cardId + '" style="' +
        'background:' + bgStyle + ' !important;' +
        (backdrop ? backdrop : '') +
        'color:' + textColor + ' !important;' +
        'border:' + borderStyle + ' !important;' +
        'border-radius:12px !important;' +
        'padding:8px 10px !important;' +
        'display:flex !important;' +
        'align-items:center !important;' +
        'gap:8px !important;' +
        'box-shadow:0 8px 24px rgba(0,0,0,0.15) !important;' +
        'pointer-events:auto !important;' +
        'transition:all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;' +
        'transform:translateY(18px) !important;' +
        'opacity:0 !important;' +
        'box-sizing:border-box !important;' +
        'font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif !important;' +
        'margin:0 !important;' +
        'width:100% !important;' +
        '">' +
        imgHtml +
        '<div style="flex:1 !important;min-width:0 !important;text-align:left !important;">' +
          '<div style="font-size:11px !important;font-weight:700 !important;line-height:1.2 !important;overflow:hidden !important;text-overflow:ellipsis !important;white-space:nowrap !important;color:' + textColor + ' !important;margin:0 !important;">' + safeEscape(ev.title) + '</div>' +
          '<div style="font-size:10px !important;color:' + subColor + ' !important;line-height:1.2 !important;margin-top:1px !important;overflow:hidden !important;text-overflow:ellipsis !important;white-space:nowrap !important;">' + safeEscape(ev.subtitle) + '</div>' +
          (ev.timeAgo ? '<div style="font-size:9px !important;color:#10B981 !important;font-weight:700 !important;margin-top:2px !important;display:flex !important;align-items:center !important;gap:2px !important;">⚡ ' + safeEscape(ev.timeAgo) + '</div>' : '') +
        '</div>' +
        '<button type="button" id="' + closeId + '" style="background:transparent !important;border:none !important;color:' + subColor + ' !important;cursor:pointer !important;padding:2px !important;font-size:12px !important;line-height:1 !important;margin-left:2px !important;flex-shrink:0 !important;outline:none !important;">✕</button>' +
      '</div>';

      container.innerHTML = cardHtml;

      var cardEl = document.getElementById(cardId);
      var closeBtn = document.getElementById(closeId);

      if (closeBtn) {
        closeBtn.onclick = function(e) {
          if (e && e.stopPropagation) e.stopPropagation();
          if (cardEl) {
            cardEl.style.setProperty("opacity", "0", "important");
            cardEl.style.setProperty("transform", "translateY(18px)", "important");
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
          cardEl.style.setProperty("transform", "translateY(18px)", "important");
        }
        setTimeout(showNextEvent, delayMs);
      }, displayMs);
    }

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
   WIDGET: INFORMACIÓN DE DESPACHO
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
   WIDGET #9: PRODUCTOS COMPLEMENTARIOS (v170 - Payload Combinado Oficial Tiendanube)
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
      html += '<div style="font-size:15px !important;font-weight:800 !important;margin-bottom:' + (subtitle ? "2px" : "12px") + ' !important;color:' + textColor + ' !important;">' + title + "</div>";
    }
    if (subtitle) {
      html += '<div style="font-size:12px !important;opacity:0.8 !important;margin-bottom:12px !important;color:' + textColor + ' !important;">' + subtitle + "</div>";
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
        ? '<span style="background:rgba(16,185,129,0.15) !important;color:#10B981 !important;border:1px solid rgba(16,185,129,0.3) !important;font-size:10px !important;font-weight:800 !important;padding:1px 5px !important;border-radius:4px !important;display:inline-block !important;margin-top:2px !important;">' + discountText + "</span>"
        : "";

      html +=
        '<div style="display:flex !important;align-items:center !important;gap:10px !important;background:rgba(255,255,255,0.05) !important;border:1px solid rgba(156,163,175,0.2) !important;border-radius:12px !important;padding:8px 12px !important;width:100% !important;box-sizing:border-box !important;">' +
        imgHtml +
        '<div style="flex:1 !important;min-width:0 !important;">' +
        '<div style="font-size:13px !important;font-weight:700 !important;white-space:nowrap !important;overflow:hidden !important;text-overflow:ellipsis !important;color:' + textColor + ' !important;">' + (item.title || "Producto") + "</div>" +
        '<div style="display:flex !important;align-items:center !important;gap:6px !important;margin-top:2px !important;">' +
        '<span style="font-size:13px !important;font-weight:800 !important;color:' + textColor + ' !important;">' + pStr + "</span>" +
        "</div>" +
        badgeHtml +
        "</div>" +
        '<button type="button" data-nvx-idx="' + i + '" class="nvx-btn-add-cross" style="background:' + buttonBg + ' !important;color:' + buttonTextColor + ' !important;padding:8px 14px !important;border-radius:8px !important;font-size:12px !important;font-weight:800 !important;border:none !important;cursor:pointer !important;flex-shrink:0 !important;white-space:nowrap !important;transition:all 0.2s ease !important;">' + buttonText + "</button>" +
        "</div>";
    }

    html += "</div>";
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
          return;
        } catch (e) {}
      }
    }
  }

  function triggerCartRefreshEvents(cartData) {
    try {
      document.dispatchEvent(new CustomEvent("cart:updated", { detail: cartData || {} }));
    } catch (eEv) {}

    if (window.jQuery) {
      try {
        window.jQuery(document).trigger("ajaxCart:receive");
        window.jQuery(document).trigger("cart:updated", [cartData]);
        window.jQuery(document).trigger("cart:change");
        window.jQuery(document).trigger("product_added_to_cart");
        window.jQuery(document).trigger("cart.updated");
        window.jQuery(document).trigger("LS:cart:updated");
        window.jQuery("body").trigger("cart:updated");
      } catch (eJQ) {}
    }

    try {
      document.dispatchEvent(new CustomEvent("ajaxCart:receive"));
      document.dispatchEvent(new CustomEvent("cart:change"));
      document.dispatchEvent(new CustomEvent("product_added_to_cart"));
      window.dispatchEvent(new CustomEvent("LS:cart:updated"));
    } catch (eDOM) {}

    if (window.LS && window.LS.cart && typeof window.LS.cart.get === "function") {
      try { window.LS.cart.get(); } catch (eLS) {}
    }
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

    function markSuccess(cartData) {
      if (btnEl) {
        btnEl.innerText = "¡Agregado al carrito! ✓";
        btnEl.style.opacity = "1";
      }

      triggerCartRefreshEvents(cartData);

      if (openCartOnAdd) {
        setTimeout(function () {
          openCartDrawer();
        }, 200);
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

    // PAYLOAD COMBINADO CONFIRMADO POR TIENDANUBE:
    // add_to_cart = ID PRODUCTO
    // variant_id  = ID VARIANTE
    // quantity    = 1
    var payload = "add_to_cart=" + encodeURIComponent(String(productId)) +
                  "&variant_id=" + encodeURIComponent(String(variantId)) +
                  "&quantity=1";

    function sendPayloadToUrl(endpointUrl) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", endpointUrl, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
        xhr.withCredentials = true;

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 400) {
              var cartRes = null;
              try { cartRes = JSON.parse(xhr.responseText); } catch (eJson) {}
              markSuccess(cartRes);
            } else if (endpointUrl === "/comprar/") {
              // Fallback a /cart/add si /comprar/ falla
              sendPayloadToUrl("/cart/add");
            } else {
              markError();
            }
          }
        };
        xhr.send(payload);
      } catch (errXhr) {
        if (endpointUrl === "/comprar/") {
          sendPayloadToUrl("/cart/add");
        } else {
          markError();
        }
      }
    }

    sendPayloadToUrl("/comprar/");
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
})(); 
