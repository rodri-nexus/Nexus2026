// public/nevux-widget.js
(function () {
  "use strict";

  const API_BASE = "https://nexus2026-gx7e.vercel.app";
  const NS = "nevux-widget";

  console.log("[Nevux] v20 loaded");

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
    if (window.NEVUX_STORE_ID) return window.NEVUX_STORE_ID;
    if (window.Store && (window.Store.id || window.Store.store_id))
      return window.Store.id || window.Store.store_id;
    if (window.LS && window.LS.store && window.LS.store.id) return window.LS.store.id;
    if (window.LS && window.LS.storeId) return window.LS.storeId;
    if (window.__NUVEMSHOP_STORE__ && window.__NUVEMSHOP_STORE__.id)
      return window.__NUVEMSHOP_STORE__.id;
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

  function detectProductPrice() {
    if (window.Product && window.Product.price) return parseFloat(window.Product.price);
    if (window.LS && window.LS.product && window.LS.product.price) {
      return parseFloat(window.LS.product.price);
    }
    const priceEl = qs('[data-store="product-price"]') ||
                    qs('.js-price-display') ||
                    qs('.price-display') ||
                    qs('span[itemprop="price"]');
    if (priceEl) {
      const txt = priceEl.textContent || priceEl.getAttribute("content") || "";
      const num = parseFloat(txt.replace(/[^\d,\.]/g, "").replace(/\./g, "").replace(",", "."));
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

  const url = API_BASE + "/api/widget-render?store_id=" + storeId +
    (productId ? "&product_id=" + productId : "");

  fetch(url)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data.widgets || data.widgets.length === 0) {
        console.log("[Nevux] No hay widgets activos");
        return;
      }
      console.log("[Nevux] Widgets recibidos:", data.widgets.length);
      data.widgets.forEach(function (w) {
        try {
          if (w.widget_slug === "cuenta-regresiva") renderCountdown(w);
          if (w.widget_slug === "badge-cuotas") renderBadgeCuotas(w);
          if (w.widget_slug === "badge-envio") renderBadgeEnvio(w);
          if (w.widget_slug === "badge-transferencia") renderBadgeTransferencia(w);
          if (w.widget_slug === "banner-deslizante") renderBannerDeslizante(w);
          if (w.widget_slug === "barra-progreso") renderBarraProgreso(w);
          if (w.widget_slug === "bundle-promociones") renderBundlePromociones(w);
          if (w.widget_slug === "bundle-cantidad") renderBundleCantidad(w);
          if (w.widget_slug === "caja-opiniones") renderCajaOpiniones(w);
          if (w.widget_slug === "info-despacho") renderInformacionDespacho(w);
          if (w.widget_slug === "info-envio") renderInformacionEnvio(w);
          if (w.widget_slug === "mensaje-alerta") renderMensajeAlerta(w);
          if (w.widget_slug === "mensaje-garantia") renderMensajeGarantia(w);
        } catch (err) {
          console.error("[Nevux] Error renderizando widget:", w.widget_slug, err);
        }
      });
    })
    .catch(function (err) {
      console.error("[Nevux] Error cargando widgets:", err);
    });

  /* ═══════════════════════════════════════════
     RENDER COUNTDOWN
  ═══════════════════════════════════════════ */
  function renderCountdown(widget) {
    const cfg = normalizeConfig(widget.config || {});
    const state = { endTime: getInitialEndTime(cfg) };

    const placements = [];
    if (cfg.showAsTopBar && pageType === "home") placements.push("topbar");
    if (cfg.showOnProduct && pageType === "product") placements.push("product");
    if (cfg.showOnCart && pageType === "cart") placements.push("cart");

    if (placements.length === 0) return;

    placements.forEach(function (p) { mountAt(widget, cfg, p, state); });
  }

  function getInitialEndTime(cfg) {
    if (cfg.endDate) {
      const t = new Date(cfg.endDate).getTime();
      if (t > Date.now()) return t;
      if (cfg.autoRestart) return Date.now() + 15 * 60 * 1000;
      return t;
    }
    return Date.now() + 15 * 60 * 1000;
  }

  function mountAt(widget, cfg, placement, state) {
    const uniqueId = NS + "-" + widget.id + "-" + placement;
    if (qs("#" + uniqueId)) return;

    const container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";
    container.dataset.placement = placement;

    if (placement === "topbar") {
      container.classList.add(NS + "-topbar");
      document.body.appendChild(container);
      requestAnimationFrame(function () {
        const h = container.offsetHeight;
        if (h > 0) {
          const prev = parseInt(document.body.style.paddingTop || "0", 10);
          document.body.style.paddingTop = (prev + h) + "px";
        }
      });
    } else if (placement === "product") {
      const target = findProductTarget(cfg.productPosition);
      if (!target) return;
      target.node.parentNode.insertBefore(container, target.node);
    } else if (placement === "cart") {
      const target = findCartTarget();
      if (!target) return;
      target.parentNode.insertBefore(container, target);
    }

    update(container, cfg, state);

    setInterval(function () {
      const now = Date.now();
      if (state.endTime <= now && cfg.autoRestart) {
        state.endTime = now + 15 * 60 * 1000;
      }
      update(container, cfg, state);
    }, 1000);
  }

  function findProductTarget(position) {
    if (position === "before-title") {
      const sel = ['h1.product-name', 'h1[itemprop="name"]', '.product-name', '.js-product-name', '.product-title', 'h1'];
      for (let i = 0; i < sel.length; i++) {
        const el = qs(sel[i]);
        if (el) return { node: el };
      }
    }
    const btnSel = [
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
    for (let i = 0; i < btnSel.length; i++) {
      const el = qs(btnSel[i]);
      if (el) return { node: el.closest("form") || el };
    }
    const btns = qsa("button");
    for (let i = 0; i < btns.length; i++) {
      const t = (btns[i].textContent || "").toLowerCase();
      if (t.indexOf("agregar al carrito") >= 0 || t.indexOf("añadir al carrito") >= 0 || t.indexOf("comprar ahora") >= 0) {
        return { node: btns[i].closest("form") || btns[i] };
      }
    }
    return null;
  }

  function findProductPriceTarget() {
    const sel = [
      '[data-store="product-price"]',
      '.js-price-display',
      '.price-display',
      'span[itemprop="price"]',
      '.product-price',
      '.js-product-price',
    ];
    for (let i = 0; i < sel.length; i++) {
      const el = qs(sel[i]);
      if (el) return el;
    }
    return null;
  }

  function findProductDescriptionTarget() {
    const sel = [
      '[data-store="product-description"]',
      '.js-product-description',
      '.product-description',
      '#product-description',
      '.description',
    ];
    for (let i = 0; i < sel.length; i++) {
      const el = qs(sel[i]);
      if (el) return el;
    }
    return null;
  }

  function findCartTarget() {
    return qs('.js-cart-page') || qs('[data-store="cart"]') ||
      qs('.cart-content') || qs('.cart-items') || qs('main') || qs('.container');
  }

  function findCartCheckoutButton() {
    var sel = [
      'button[data-store="cart-checkout-button"]',
      'a[data-store="cart-checkout-button"]',
      '.js-cart-checkout',
      '.js-checkout',
      'a[href*="/checkout"]',
      'button[name="checkout"]',
    ];
    for (var i = 0; i < sel.length; i++) {
      var el = qs(sel[i]);
      if (el) return el;
    }
    return null;
  }

  function normalizeConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      const p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      title: raw.title != null ? raw.title : "🔥 Oferta",
      subtitle: raw.subtitle != null ? raw.subtitle : "",
      endDate: raw.endDate || "",
      showDays: raw.showDays === true,
      showHours: raw.showHours !== false,
      showMinutes: raw.showMinutes !== false,
      showSeconds: raw.showSeconds !== false,
      autoRestart: raw.autoRestart === true,
      showOnProduct: raw.showOnProduct !== false,
      productPosition: raw.productPosition || "before-button",
      showAsTopBar: raw.showAsTopBar === true,
      showOnCart: raw.showOnCart === true,
      style: raw.style === "retro" ? "retro" : "clasico",
      alignment: raw.alignment === "left" ? "left" : "center",
      showLabels: raw.showLabels !== false,
      bgType: raw.bgType === "gradient" ? "gradient" : "solid",
      colorWidgetBg: raw.colorWidgetBg || "#1e1e1e",
      colorSubtitleBg: raw.colorSubtitleBg || "#fdc624",
      colorClockBg: raw.colorClockBg || "#ef4444",
      colorTitle: raw.colorTitle || "#ffffff",
      colorSubtitle: raw.colorSubtitle || "#000000",
      colorNumbers: raw.colorNumbers || "#ffffff",
      fontSizeTitle: raw.fontSizeTitle || "16px",
      fontSizeSubtitle: raw.fontSizeSubtitle || "11px",
      fontSizeClock: raw.fontSizeClock || "16px",
      borderRadiusClock: n(raw.borderRadiusClock, 5),
      borderRadiusWidget: n(raw.borderRadiusWidget, 12),
      paddingWidget: n(raw.paddingWidget, 15),
      paddingClock: n(raw.paddingClock, 7),
    };
  }

  function calcTime(state) {
    const ms = state.endTime - Date.now();
    if (ms <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isFinished: true };
    }
    const t = Math.floor(ms / 1000);
    return {
      days: Math.floor(t / 86400),
      hours: Math.floor((t % 86400) / 3600),
      minutes: Math.floor((t % 3600) / 60),
      seconds: t % 60,
      totalSeconds: t,
      isFinished: false,
    };
  }

  function update(container, cfg, state) {
    const time = calcTime(state);

    if (time.isFinished && !cfg.autoRestart) {
      container.innerHTML =
        '<div style="background:' + getBg(cfg) + ';border-radius:' + cfg.borderRadiusWidget + 'px;padding:' + cfg.paddingWidget + 'px;text-align:' + cfg.alignment + ';color:' + cfg.colorTitle + ';font-weight:700;">' +
        '⏰ ¡La oferta terminó!</div>';
      return;
    }

    const isBar = container.dataset.placement === "topbar";
    const units = buildUnits(cfg, time);

    if (units.length === 0) {
      container.innerHTML = "";
      return;
    }

    const keys = units.map(function (u) { return u.k; }).join(",");
    let host = qs("." + NS + "-widget-host", container);

    const needsRebuild =
      !host ||
      host.dataset.style !== cfg.style ||
      host.dataset.keys !== keys ||
      host.dataset.bar !== String(isBar);

    if (needsRebuild) {
      container.innerHTML = isBar
        ? buildBarHtml(cfg, units, time)
        : buildFullHtml(cfg, units, time);
    } else {
      if (isBar) {
        updateBarDigits(host, units);
      } else {
        units.forEach(function (u) { updateUnit(host, u, cfg); });
      }
    }
  }

  function buildUnits(cfg, time) {
    const arr = [];
    const showDaysActive = cfg.showDays && time.days > 0;
    if (showDaysActive) arr.push({ v: time.days, l: "DÍAS", k: "d" });
    if (cfg.showHours) {
      const hoursValue = showDaysActive ? time.hours : time.hours + time.days * 24;
      arr.push({ v: hoursValue, l: "HRS", k: "h" });
    }
    if (cfg.showMinutes) arr.push({ v: time.minutes, l: "MIN", k: "m" });
    if (cfg.showSeconds) arr.push({ v: time.seconds, l: "SEG", k: "s" });
    return arr;
  }

  function buildBarHtml(cfg, units, time) {
    const bg = cfg.bgType === "gradient"
      ? "linear-gradient(90deg, " + cfg.colorWidgetBg + " 0%, " + cfg.colorSubtitleBg + " 100%)"
      : cfg.colorWidgetBg;

    const split = splitEmoji(cfg.title);
    const fullText = cfg.subtitle
      ? (split.text ? split.text + " — " + cfg.subtitle : cfg.subtitle)
      : split.text;

    let titleHtml = "";
    if (split.emoji || fullText) {
      titleHtml =
        '<div class="' + NS + '-bar-title" style="color:' + cfg.colorTitle + ';">' +
        (split.emoji ? '<span class="' + NS + '-bar-emoji">' + escapeHtml(split.emoji) + '</span>' : "") +
        escapeHtml(fullText) +
        '</div>';
    }

    let clockInner = "";
    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      const val = String(u.v).padStart(2, "0");
      clockInner += '<div class="' + NS + '-bar-digit" data-key="' + u.k + '">' + val + '</div>';
      if (i < units.length - 1) {
        clockInner += '<span class="' + NS + '-bar-sep" style="color:' + cfg.colorTitle + ';">:</span>';
      }
    }

    return '' +
      '<div class="' + NS + '-widget-host ' + NS + '-bar" data-style="' + cfg.style + '" data-keys="' + units.map(function (u) { return u.k; }).join(",") + '" data-bar="true" style="background:' + bg + ';">' +
      titleHtml +
      '<div class="' + NS + '-bar-row">' +
        '<div class="' + NS + '-bar-clock">' + clockInner + '</div>' +
        '<button class="' + NS + '-bar-btn" style="color:' + cfg.colorWidgetBg + ';" onclick="window.location.href=\'/\'">SHOP NOW</button>' +
      '</div>' +
      '</div>';
  }

  function updateBarDigits(host, units) {
    units.forEach(function (u) {
      const el = qs("." + NS + "-bar-digit[data-key=\"" + u.k + "\"]", host);
      if (!el) return;
      const val = String(u.v).padStart(2, "0");
      if (el.textContent === val) return;
      el.textContent = val;
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = NS + "-bounceDigit 0.4s ease";
    });
  }

  function buildFullHtml(cfg, units, time) {
    const bg = getBg(cfg);
    const titleHtml = cfg.title
      ? '<div style="font-size:' + cfg.fontSizeTitle + ';font-weight:700;color:' + cfg.colorTitle + ';margin-bottom:14px;line-height:1.2;text-align:' + cfg.alignment + ';">' + escapeHtml(cfg.title) + '</div>'
      : "";

    let clockInner = "";
    for (let i = 0; i < units.length; i++) {
      clockInner += renderUnit(units[i], cfg);
      if (i < units.length - 1) clockInner += renderSep(cfg);
    }

    const subtitleHtml = cfg.subtitle
      ? '<div style="margin-bottom:14px;text-align:' + cfg.alignment + ';">' +
          '<span style="display:inline-block;background:' + cfg.colorSubtitleBg + ';color:' + cfg.colorSubtitle + ';font-size:' + cfg.fontSizeSubtitle + ';font-weight:700;padding:4px 10px;border-radius:6px;">' +
            escapeHtml(cfg.subtitle) +
          '</span>' +
        '</div>'
      : "";

    return '' +
      '<div class="' + NS + '-widget-host" data-style="' + cfg.style + '" data-keys="' + units.map(function (u) { return u.k; }).join(",") + '" data-bar="false" style="background:' + bg + ';border-radius:' + cfg.borderRadiusWidget + 'px;padding:' + cfg.paddingWidget + 'px;text-align:' + cfg.alignment + ';">' +
        titleHtml +
        subtitleHtml +
        '<div style="display:flex;align-items:center;justify-content:' + (cfg.alignment === "center" ? "center" : "flex-start") + ';gap:8px;flex-wrap:wrap;">' + clockInner + '</div>' +
      '</div>';
  }

  function renderUnit(u, cfg) {
    const val = String(u.v).padStart(2, "0");
    const size = parseInt(cfg.fontSizeClock, 10) || 16;
    const labelSize = Math.max(9, Math.round(size * 0.55));
    const labelHtml = cfg.showLabels
      ? '<span class="' + NS + '-label" style="font-size:' + labelSize + 'px;color:' + cfg.colorTitle + ';opacity:0.8;">' + u.l + '</span>'
      : "";

    if (cfg.style === "retro") {
      const chars = val.split("");
      let cells = "";
      for (let i = 0; i < chars.length; i++) {
        cells += '<span class="' + NS + '-retro-cell" style="font-size:' + cfg.fontSizeClock + ';color:' + cfg.colorNumbers + ';">' + chars[i] + '</span>';
      }
      return '<div class="' + NS + '-unit" data-key="' + u.k + '"><div class="' + NS + '-retro-digit" data-value="' + val + '">' + cells + '</div>' + labelHtml + '</div>';
    }

    return '<div class="' + NS + '-unit" data-key="' + u.k + '">' +
      '<div class="' + NS + '-digit" data-value="' + val + '" style="min-width:' + (size * 2.5) + 'px;min-height:' + (size * 2.5) + 'px;background:' + cfg.colorClockBg + ';color:' + cfg.colorNumbers + ';border-radius:' + cfg.borderRadiusClock + 'px;padding:' + cfg.paddingClock + 'px ' + (cfg.paddingClock + 2) + 'px;font-size:' + cfg.fontSizeClock + ';line-height:1;">' + val + '</div>' + labelHtml +
    '</div>';
  }

  function renderSep(cfg) {
    const size = parseInt(cfg.fontSizeClock, 10) || 16;
    const dotSize = Math.max(3, Math.round(size * 0.18));
    const padBottom = cfg.showLabels ? Math.round(size * 0.85) : 0;
    const dot = '<span style="width:' + dotSize + 'px;height:' + dotSize + 'px;background:' + cfg.colorTitle + ';"></span>';
    return '<div class="' + NS + '-sep" style="padding-bottom:' + padBottom + 'px;gap:' + dotSize + 'px;">' + dot + dot + '</div>';
  }

  function updateUnit(host, u, cfg) {
    const unitEl = qs("." + NS + "-unit[data-key=\"" + u.k + "\"]", host);
    if (!unitEl) return;
    const val = String(u.v).padStart(2, "0");

    if (cfg.style === "retro") {
      const wrap = qs("." + NS + "-retro-digit", unitEl);
      if (!wrap || wrap.dataset.value === val) return;
      wrap.dataset.value = val;
      const cells = qsa("." + NS + "-retro-cell", wrap);
      const chars = val.split("");
      for (let i = 0; i < chars.length; i++) {
        if (cells[i] && cells[i].textContent !== chars[i]) {
          cells[i].textContent = chars[i];
          cells[i].classList.remove("flip");
          void cells[i].offsetWidth;
          cells[i].classList.add("flip");
        }
      }
      return;
    }

    const digit = qs("." + NS + "-digit", unitEl);
    if (!digit || digit.dataset.value === val) return;
    digit.dataset.value = val;
    digit.textContent = val;
    digit.classList.remove("bounce");
    void digit.offsetWidth;
    digit.classList.add("bounce");
  }

  function getBg(cfg) {
    return cfg.bgType === "gradient"
      ? "linear-gradient(135deg, " + cfg.colorWidgetBg + " 0%, " + cfg.colorSubtitleBg + " 100%)"
      : cfg.colorWidgetBg;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
      }
    /* ═══════════════════════════════════════════
     RENDER BADGE CUOTAS
  ═══════════════════════════════════════════ */
  function renderBadgeCuotas(widget) {
    const cfg = normalizeBadgeCuotasConfig(widget.config || {});

    if (cfg.mostrarEnProducto && pageType === "product") {
      mountBadgeCuotas(widget, cfg, "product");
    }
    if (cfg.mostrarEnGrilla && (pageType === "home" || pageType === "other")) {
      mountBadgeCuotas(widget, cfg, "grilla");
    }
  }

  function normalizeBadgeCuotasConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      cuotasSeleccionadas: Array.isArray(raw.cuotasSeleccionadas) ? raw.cuotasSeleccionadas : [3, 6, 12],
      mensaje: raw.mensaje || "{cuotas} cuotas sin interés de {monto}",
      mostrarIconoTarjeta: raw.mostrarIconoTarjeta === true,
      textoBadge: raw.textoBadge || "",
      efectoRebote: raw.efectoRebote === true,
      posicionBadge: raw.posicionBadge === "final-texto" ? "final-texto" : "esquina-superior-derecha",
      mostrarEnProducto: raw.mostrarEnProducto !== false,
      mostrarEnGrilla: raw.mostrarEnGrilla === true,
      colorFondo: raw.colorFondo || "#ededed",
      colorTexto: raw.colorTexto || "#000000",
      fondoDegradado: raw.fondoDegradado === true,
      fontSize: raw.fontSize || "13px",
      mostrarBorde: raw.mostrarBorde === true,
      paddingInterno: n(raw.paddingInterno, 10),
      bordesRedondeados: n(raw.bordesRedondeados, 25),
      efecto: raw.efecto === "aureola" ? "aureola" : (raw.efecto === "zoom" ? "zoom" : "sin-efecto"),
      colorFondoBadge: raw.colorFondoBadge || "#ff0000",
      colorTextoBadge: raw.colorTextoBadge || "#ffffff",
    };
  }

  function mountBadgeCuotas(widget, cfg, placement) {
    var uniqueId = NS + "-badge-" + widget.id + "-" + placement;
    if (qs("#" + uniqueId)) return;

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (placement === "product") {
      var target = findProductTarget("before-button");
      if (!target) {
        console.warn("[Nevux] No se encontró target para badge cuotas en producto");
        return;
      }
      target.node.parentNode.insertBefore(container, target.node);
    } else if (placement === "grilla") {
      var grillaTargets = qsa('.js-item-price, .price-display, [data-store="product-price"]');
      if (grillaTargets.length === 0) return;
      grillaTargets.forEach(function (target, idx) {
        var mini = document.createElement("div");
        mini.className = NS + "-root";
        mini.id = uniqueId + "-" + idx;
        mini.innerHTML = buildBadgeCuotasHtml(cfg);
        target.parentNode.insertBefore(mini, target.nextSibling);
      });
      return;
    }

    container.innerHTML = buildBadgeCuotasHtml(cfg);
    console.log("[Nevux] Badge cuotas montado en", placement);
  }

  function buildBadgeCuotasHtml(cfg) {
    var cuotasOrdenadas = (cfg.cuotasSeleccionadas || []).slice().sort(function (a, b) { return b - a; });
    var cuotaShow = cuotasOrdenadas.length > 0 ? cuotasOrdenadas[0] : 3;

    var precio = detectProductPrice();
    var montoTxt = "$****";
    if (precio && precio > 0) {
      montoTxt = formatMoney(precio / cuotaShow);
    }

    var mensaje = (cfg.mensaje || "{cuotas} cuotas sin interés de {monto}")
      .replace("{cuotas}", String(cuotaShow))
      .replace("{monto}", montoTxt);

    var fondo = cfg.fondoDegradado
      ? "linear-gradient(135deg, " + cfg.colorFondo + " 0%, " + cfg.colorFondo + "dd 100%)"
      : cfg.colorFondo;

    var borde = cfg.mostrarBorde ? "1px solid " + cfg.colorTexto + "22" : "none";

    var animation =
      cfg.efecto === "aureola" ? NS + "-aureolaPulse 2s ease-in-out infinite" :
      cfg.efecto === "zoom" ? NS + "-zoomEffect 2s ease-in-out infinite" :
      "none";

    var showBadge = cfg.textoBadge && cfg.textoBadge.trim().length > 0;
    var badgeAnim = cfg.efectoRebote ? NS + "-bounceBadge 1.2s ease-in-out infinite" : "none";

    var iconHtml = cfg.mostrarIconoTarjeta
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + cfg.colorTexto + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>'
      : "";

    var badgeInlineHtml = "";
    var badgeCornerHtml = "";
    if (showBadge) {
      var fontSizeNum = parseInt(cfg.fontSize, 10) || 13;
      if (cfg.posicionBadge === "final-texto") {
        badgeInlineHtml = '<span style="display:inline-block;background:' + cfg.colorFondoBadge + ';color:' + cfg.colorTextoBadge + ';font-size:' + Math.max(9, fontSizeNum - 3) + 'px;font-weight:800;padding:2px 8px;border-radius:4px;letter-spacing:0.05em;text-transform:uppercase;margin-left:4px;animation:' + badgeAnim + ';">' + escapeHtml(cfg.textoBadge) + '</span>';
      } else {
        badgeCornerHtml = '<span style="position:absolute;top:-10px;right:-8px;background:' + cfg.colorFondoBadge + ';color:' + cfg.colorTextoBadge + ';font-size:10px;font-weight:800;padding:3px 8px;border-radius:6px;letter-spacing:0.05em;text-transform:uppercase;box-shadow:0 2px 6px rgba(0,0,0,0.15);animation:' + badgeAnim + ';white-space:nowrap;z-index:2;">' + escapeHtml(cfg.textoBadge) + '</span>';
      }
    }

    return '' +
      '<div style="display:flex;justify-content:flex-start;padding:8px 0;">' +
        '<div style="position:relative;display:inline-block;">' +
          '<div style="display:inline-flex;align-items:center;gap:8px;background:' + fondo + ';color:' + cfg.colorTexto + ';font-size:' + cfg.fontSize + ';font-weight:500;padding:' + cfg.paddingInterno + 'px ' + (cfg.paddingInterno + 8) + 'px;border-radius:' + cfg.bordesRedondeados + 'px;border:' + borde + ';animation:' + animation + ';white-space:nowrap;">' +
            iconHtml +
            '<span>' + escapeHtml(mensaje) + '</span>' +
            badgeInlineHtml +
          '</div>' +
          badgeCornerHtml +
        '</div>' +
      '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER BADGE ENVÍO
  ═══════════════════════════════════════════ */
  function renderBadgeEnvio(widget) {
    const cfg = normalizeBadgeEnvioConfig(widget.config || {});

    if (cfg.mostrarEnProducto && pageType === "product") {
      mountBadgeEnvio(widget, cfg, "product");
    }
    if (cfg.mostrarEnGrilla && (pageType === "home" || pageType === "other")) {
      mountBadgeEnvio(widget, cfg, "grilla");
    }
  }

  function normalizeBadgeEnvioConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      modoEnvio: raw.modoEnvio === "a-partir-de" ? "a-partir-de" : "siempre",
      mostrarIcono: raw.mostrarIcono !== false,
      textoBadge: raw.textoBadge || "",
      efectoRebote: raw.efectoRebote === true,
      posicionBadge: raw.posicionBadge === "final-texto" ? "final-texto" : "esquina-superior-derecha",
      mostrarEnProducto: raw.mostrarEnProducto !== false,
      mostrarEnGrilla: raw.mostrarEnGrilla === true,
      colorFondo: raw.colorFondo || "#ededed",
      colorTexto: raw.colorTexto || "#000000",
      fondoDegradado: raw.fondoDegradado === true,
      fontSize: raw.fontSize || "13px",
      mostrarBorde: raw.mostrarBorde === true,
      paddingInterno: n(raw.paddingInterno, 10),
      bordesRedondeados: n(raw.bordesRedondeados, 25),
      efecto: raw.efecto === "aureola" ? "aureola" : (raw.efecto === "zoom" ? "zoom" : "sin-efecto"),
      colorFondoBadge: raw.colorFondoBadge || "#ff0000",
      colorTextoBadge: raw.colorTextoBadge || "#ffffff",
    };
  }

  function mountBadgeEnvio(widget, cfg, placement) {
    var uniqueId = NS + "-envio-" + widget.id + "-" + placement;
    if (qs("#" + uniqueId)) return;

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (placement === "product") {
      var target = findProductTarget("before-button");
      if (!target) {
        console.warn("[Nevux] No se encontró target para badge envío en producto");
        return;
      }
      target.node.parentNode.insertBefore(container, target.node);
    } else if (placement === "grilla") {
      var grillaTargets = qsa('.js-item-price, .price-display, [data-store="product-price"]');
      if (grillaTargets.length === 0) return;
      grillaTargets.forEach(function (target, idx) {
        var mini = document.createElement("div");
        mini.className = NS + "-root";
        mini.id = uniqueId + "-" + idx;
        mini.innerHTML = buildBadgeEnvioHtml(cfg);
        target.parentNode.insertBefore(mini, target.nextSibling);
      });
      return;
    }

    container.innerHTML = buildBadgeEnvioHtml(cfg);
    console.log("[Nevux] Badge envío montado en", placement);
  }

  function buildBadgeEnvioHtml(cfg) {
    var fondo = cfg.fondoDegradado
      ? "linear-gradient(135deg, " + cfg.colorFondo + " 0%, " + cfg.colorFondo + "dd 100%)"
      : cfg.colorFondo;

    var borde = cfg.mostrarBorde ? "1px solid " + cfg.colorTexto + "22" : "none";

    var animation =
      cfg.efecto === "aureola" ? NS + "-aureolaPulse 2s ease-in-out infinite" :
      cfg.efecto === "zoom" ? NS + "-zoomEffect 2s ease-in-out infinite" :
      "none";

    var showBadge = cfg.textoBadge && cfg.textoBadge.trim().length > 0;
    var badgeAnim = cfg.efectoRebote ? NS + "-bounceBadge 1.2s ease-in-out infinite" : "none";

    var iconHtml = cfg.mostrarIcono
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="' + cfg.colorTexto + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>'
      : "";

    var badgeInlineHtml = "";
    var badgeCornerHtml = "";
    if (showBadge) {
      var fontSizeNum = parseInt(cfg.fontSize, 10) || 13;
      if (cfg.posicionBadge === "final-texto") {
        badgeInlineHtml = '<span style="display:inline-block;background:' + cfg.colorFondoBadge + ';color:' + cfg.colorTextoBadge + ';font-size:' + Math.max(9, fontSizeNum - 3) + 'px;font-weight:800;padding:2px 8px;border-radius:4px;letter-spacing:0.05em;text-transform:uppercase;margin-left:4px;animation:' + badgeAnim + ';">' + escapeHtml(cfg.textoBadge) + '</span>';
      } else {
        badgeCornerHtml = '<span style="position:absolute;top:-10px;right:-8px;background:' + cfg.colorFondoBadge + ';color:' + cfg.colorTextoBadge + ';font-size:10px;font-weight:800;padding:3px 8px;border-radius:6px;letter-spacing:0.05em;text-transform:uppercase;box-shadow:0 2px 6px rgba(0,0,0,0.15);animation:' + badgeAnim + ';white-space:nowrap;z-index:2;">' + escapeHtml(cfg.textoBadge) + '</span>';
      }
    }

    return '' +
      '<div style="display:flex;justify-content:flex-start;padding:8px 0;">' +
        '<div style="position:relative;display:inline-block;">' +
          '<div style="display:inline-flex;align-items:center;gap:8px;background:' + fondo + ';color:' + cfg.colorTexto + ';font-size:' + cfg.fontSize + ';font-weight:500;padding:' + cfg.paddingInterno + 'px ' + (cfg.paddingInterno + 8) + 'px;border-radius:' + cfg.bordesRedondeados + 'px;border:' + borde + ';animation:' + animation + ';white-space:nowrap;">' +
            iconHtml +
            '<span>Envío gratis</span>' +
            badgeInlineHtml +
          '</div>' +
          badgeCornerHtml +
        '</div>' +
      '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER BADGE TRANSFERENCIA
  ═══════════════════════════════════════════ */
  function renderBadgeTransferencia(widget) {
    const cfg = normalizeBadgeTransferenciaConfig(widget.config || {});

    if (cfg.mostrarEnProducto && pageType === "product") {
      mountBadgeTransferencia(widget, cfg, "product");
    }
    if (cfg.mostrarEnGrilla && (pageType === "home" || pageType === "other")) {
      mountBadgeTransferencia(widget, cfg, "grilla");
    }
  }

  function normalizeBadgeTransferenciaConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      porcentajeDescuento: raw.porcentajeDescuento || "",
      tipoMensaje: raw.tipoMensaje === "precio" ? "precio" : "descuento",
      mensajeDescuento: raw.mensajeDescuento || "{descuento}% de descuento pagando con transferencia",
      mensajePrecio: raw.mensajePrecio || "{precio} pagando con transferencia",
      mostrarIcono: raw.mostrarIcono === true,
      textoBadge: raw.textoBadge || "",
      efectoRebote: raw.efectoRebote === true,
      posicionBadge: raw.posicionBadge === "final-texto" ? "final-texto" : "esquina-superior-derecha",
      mostrarEnProducto: raw.mostrarEnProducto !== false,
      mostrarEnGrilla: raw.mostrarEnGrilla === true,
      colorFondo: raw.colorFondo || "#ededed",
      colorTexto: raw.colorTexto || "#191919",
      fondoDegradado: raw.fondoDegradado === true,
      fontSize: raw.fontSize || "13px",
      mostrarBorde: raw.mostrarBorde === true,
      paddingInterno: n(raw.paddingInterno, 10),
      bordesRedondeados: n(raw.bordesRedondeados, 25),
      efecto: raw.efecto === "aureola" ? "aureola" : (raw.efecto === "zoom" ? "zoom" : "sin-efecto"),
      colorFondoBadge: raw.colorFondoBadge || "#ff0000",
      colorTextoBadge: raw.colorTextoBadge || "#ffffff",
    };
  }

  function mountBadgeTransferencia(widget, cfg, placement) {
    var uniqueId = NS + "-transfer-" + widget.id + "-" + placement;
    if (qs("#" + uniqueId)) return;

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (placement === "product") {
      var target = findProductTarget("before-button");
      if (!target) {
        console.warn("[Nevux] No se encontró target para badge transferencia en producto");
        return;
      }
      target.node.parentNode.insertBefore(container, target.node);
    } else if (placement === "grilla") {
      var grillaTargets = qsa('.js-item-price, .price-display, [data-store="product-price"]');
      if (grillaTargets.length === 0) return;
      grillaTargets.forEach(function (target, idx) {
        var mini = document.createElement("div");
        mini.className = NS + "-root";
        mini.id = uniqueId + "-" + idx;
        mini.innerHTML = buildBadgeTransferenciaHtml(cfg);
        target.parentNode.insertBefore(mini, target.nextSibling);
      });
      return;
    }

    container.innerHTML = buildBadgeTransferenciaHtml(cfg);
    console.log("[Nevux] Badge transferencia montado en", placement);
  }

  function buildBadgeTransferenciaHtml(cfg) {
    var texto = "";
    var descuento = cfg.porcentajeDescuento && cfg.porcentajeDescuento.trim() !== ""
      ? cfg.porcentajeDescuento.trim()
      : "X";

    if (cfg.tipoMensaje === "precio") {
      var precio = detectProductPrice();
      var precioTxt = "$X.XXX";
      var descNum = parseFloat(descuento);
      if (precio && precio > 0 && !isNaN(descNum) && descNum > 0) {
        var precioFinal = precio * (1 - descNum / 100);
        precioTxt = formatMoney(precioFinal);
      }
      texto = (cfg.mensajePrecio || "{precio} pagando con transferencia")
        .replace("{precio}", precioTxt);
    } else {
      texto = (cfg.mensajeDescuento || "{descuento}% de descuento pagando con transferencia")
        .replace("{descuento}", descuento);
    }

    var fondo = cfg.fondoDegradado
      ? "linear-gradient(135deg, " + cfg.colorFondo + " 0%, " + cfg.colorFondo + "dd 100%)"
      : cfg.colorFondo;

    var borde = cfg.mostrarBorde ? "1px solid " + cfg.colorTexto + "22" : "none";

    var animation =
      cfg.efecto === "aureola" ? NS + "-aureolaPulse 2s ease-in-out infinite" :
      cfg.efecto === "zoom" ? NS + "-zoomEffect 2s ease-in-out infinite" :
      "none";

    var showBadge = cfg.textoBadge && cfg.textoBadge.trim().length > 0;
    var badgeAnim = cfg.efectoRebote ? NS + "-bounceBadge 1.2s ease-in-out infinite" : "none";

    var iconHtml = cfg.mostrarIcono
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="' + cfg.colorTexto + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01"/><path d="M18 12h.01"/></svg>'
      : "";

    var badgeInlineHtml = "";
    var badgeCornerHtml = "";
    if (showBadge) {
      var fontSizeNum = parseInt(cfg.fontSize, 10) || 13;
      if (cfg.posicionBadge === "final-texto") {
        badgeInlineHtml = '<span style="display:inline-block;background:' + cfg.colorFondoBadge + ';color:' + cfg.colorTextoBadge + ';font-size:' + Math.max(9, fontSizeNum - 3) + 'px;font-weight:800;padding:2px 8px;border-radius:4px;letter-spacing:0.05em;text-transform:uppercase;margin-left:4px;animation:' + badgeAnim + ';">' + escapeHtml(cfg.textoBadge) + '</span>';
      } else {
        badgeCornerHtml = '<span style="position:absolute;top:-10px;right:-8px;background:' + cfg.colorFondoBadge + ';color:' + cfg.colorTextoBadge + ';font-size:10px;font-weight:800;padding:3px 8px;border-radius:6px;letter-spacing:0.05em;text-transform:uppercase;box-shadow:0 2px 6px rgba(0,0,0,0.15);animation:' + badgeAnim + ';white-space:nowrap;z-index:2;">' + escapeHtml(cfg.textoBadge) + '</span>';
      }
    }

    return '' +
      '<div style="display:flex;justify-content:flex-start;padding:8px 0;">' +
        '<div style="position:relative;display:inline-block;">' +
          '<div style="display:inline-flex;align-items:center;gap:8px;background:' + fondo + ';color:' + cfg.colorTexto + ';font-size:' + cfg.fontSize + ';font-weight:500;padding:' + cfg.paddingInterno + 'px ' + (cfg.paddingInterno + 8) + 'px;border-radius:' + cfg.bordesRedondeados + 'px;border:' + borde + ';animation:' + animation + ';white-space:nowrap;">' +
            iconHtml +
            '<span>' + escapeHtml(texto) + '</span>' +
            badgeInlineHtml +
          '</div>' +
          badgeCornerHtml +
        '</div>' +
      '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER BANNER DESLIZANTE
  ═══════════════════════════════════════════ */
  function renderBannerDeslizante(widget) {
    const cfg = normalizeBannerDeslizanteConfig(widget.config || {});

    if (cfg.modoBarra) {
      mountBannerDeslizante(widget, cfg, "topbar");
    }
    if (cfg.mostrarEnProducto && pageType === "product") {
      mountBannerDeslizante(widget, cfg, "product");
    }
  }

  function normalizeBannerDeslizanteConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseFloat(v) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      mensajes: Array.isArray(raw.mensajes) && raw.mensajes.length > 0
        ? raw.mensajes.filter(function (m) { return m && String(m).trim().length > 0; })
        : ["🎉 ¡Envío gratis en compras nuevas a $25000!"],
      mostrarEnProducto: raw.mostrarEnProducto !== false,
      ubicacionProducto: raw.ubicacionProducto === "despues-precio" ? "despues-precio" : "despues-boton",
      modoBarra: raw.modoBarra === true,
      tipoFondo: raw.tipoFondo === "degradado" ? "degradado" : "solido",
      colorFondo: raw.colorFondo || "#333333",
      colorFondoInicio: raw.colorFondoInicio || "#333333",
      colorFondoFin: raw.colorFondoFin || "#555555",
      colorTexto: raw.colorTexto || "#ffffff",
      tamanoFuente: n(raw.tamanoFuente, 16),
      bordeRadio: n(raw.bordeRadio, 8),
      separacionMensajes: n(raw.separacionMensajes, 300),
      velocidad: n(raw.velocidad, 20),
    };
  }

  function mountBannerDeslizante(widget, cfg, placement) {
    var uniqueId = NS + "-banner-" + widget.id + "-" + placement;
    if (qs("#" + uniqueId)) return;

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (placement === "topbar") {
      container.style.margin = "0";
      if (document.body.firstChild) {
        document.body.insertBefore(container, document.body.firstChild);
      } else {
        document.body.appendChild(container);
      }
    } else if (placement === "product") {
      var target = null;
      if (cfg.ubicacionProducto === "despues-precio") {
        target = findProductPriceTarget();
        if (target && target.parentNode) {
          target.parentNode.insertBefore(container, target.nextSibling);
        } else {
          console.warn("[Nevux] No se encontró target de precio para banner deslizante");
          return;
        }
      } else {
        var t = findProductTarget("before-button");
        if (!t) {
          console.warn("[Nevux] No se encontró target de botón para banner deslizante");
          return;
        }
        if (t.node.parentNode) {
          t.node.parentNode.insertBefore(container, t.node.nextSibling);
        } else {
          return;
        }
      }
    }

    container.innerHTML = buildBannerDeslizanteHtml(cfg, placement);
    console.log("[Nevux] Banner deslizante montado en", placement);
  }

  function buildBannerDeslizanteHtml(cfg, placement) {
    var isBar = placement === "topbar";
    var fondo = cfg.tipoFondo === "degradado"
      ? "linear-gradient(90deg, " + cfg.colorFondoInicio + " 0%, " + cfg.colorFondoFin + " 100%)"
      : cfg.colorFondo;

    var borderRadius = isBar ? "0" : cfg.bordeRadio + "px";
    var separacion = cfg.separacionMensajes;
    var velocidad = cfg.velocidad;

    var mensajesRender = cfg.mensajes.concat(cfg.mensajes);

    var itemsHtml = "";
    for (var i = 0; i < mensajesRender.length; i++) {
      itemsHtml += '<span class="' + NS + '-banner-item" style="padding-right:' + separacion + 'px;font-size:' + cfg.tamanoFuente + 'px;color:' + cfg.colorTexto + ';">' +
        escapeHtml(mensajesRender[i]) +
      '</span>';
    }

    return '' +
      '<div class="' + NS + '-banner-wrap" style="background:' + fondo + ';color:' + cfg.colorTexto + ';border-radius:' + borderRadius + ';padding:14px 0;font-size:' + cfg.tamanoFuente + 'px;font-weight:500;line-height:1.2;">' +
        '<div class="' + NS + '-banner-track" style="animation:' + NS + '-banner-scroll ' + velocidad + 's linear infinite;">' +
          itemsHtml +
        '</div>' +
      '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER BARRA DE PROGRESO
  ═══════════════════════════════════════════ */
  function renderBarraProgreso(widget) {
    var cfg = normalizeBarraProgresoConfig(widget.config || {});

    if (!cfg.objetivos || cfg.objetivos.length === 0) return;

    var mountedContainers = [];

    if (pageType === "product" && cfg.posicionFicha !== "no-mostrar") {
      var containerProd = mountBarraProgreso(widget, cfg, "product");
      if (containerProd) mountedContainers.push(containerProd);
    }
    if (cfg.elementoFlotante) {
      var containerFloat = mountBarraProgreso(widget, cfg, "floating");
      if (containerFloat) mountedContainers.push(containerFloat);
    }
    if (cfg.enCarrito && pageType === "cart") {
      var containerCart = mountBarraProgreso(widget, cfg, "cart");
      if (containerCart) mountedContainers.push(containerCart);
    }

    if (mountedContainers.length === 0) return;

    function refreshAll() {
      fetchCartSubtotal(function (subtotal) {
        mountedContainers.forEach(function (c) {
          c.innerHTML = buildBarraProgresoHtml(cfg, subtotal, c._placement);
        });
      });
    }

    refreshAll();
    setInterval(refreshAll, 3000);

    var events = ["cart.update", "cart:update", "cart_updated", "cartUpdated"];
    events.forEach(function (ev) {
      try {
        document.addEventListener(ev, refreshAll);
        window.addEventListener(ev, refreshAll);
      } catch (e) {}
    });
  }

  function normalizeBarraProgresoConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseFloat(v) : v;
      return isNaN(p) ? fb : p;
    }
    var objetivos = Array.isArray(raw.objetivos) ? raw.objetivos : [];
    objetivos = objetivos
      .filter(function (o) { return o && o.nombre && o.monto > 0; })
      .map(function (o) {
        return {
          nombre: String(o.nombre),
          monto: parseFloat(o.monto) || 0,
          icono: o.icono || "none",
        };
      });
    if (objetivos.length === 0) {
      objetivos = [{ nombre: "Envío gratis", monto: 50000, icono: "none" }];
    }
    return {
      objetivos: objetivos,
      textoFaltante: raw.textoFaltante || "Te faltan {x} para {objetivo}",
      textoCumplido: raw.textoCumplido || "¡{objetivo} desbloqueado! 🎉",
      posicionFicha: raw.posicionFicha === "encima-form" ? "encima-form" :
                     raw.posicionFicha === "no-mostrar" ? "no-mostrar" : "debajo-boton",
      elementoFlotante: raw.elementoFlotante === true,
      enCarrito: raw.enCarrito === true,
      formatoObjetivos: raw.formatoObjetivos === "lista" ? "lista" : "automatico",
      bordesRedondeados: n(raw.bordesRedondeados, 8),
      rellenoInterno: n(raw.rellenoInterno, 14),
      colorBarraVacia: raw.colorBarraVacia || "#e0e0e0",
      colorBarraLlena: raw.colorBarraLlena || "#22c55e",
      colorFondo: raw.colorFondo || "#fafafa",
      colorTexto: raw.colorTexto || "#333333",
      colorMonto: raw.colorMonto || "#0d6efd",
      colorObjetivos: raw.colorObjetivos || "#333333",
      tamanoFuenteObjetivos: n(raw.tamanoFuenteObjetivos, 11),
      tamanoFuenteTexto: n(raw.tamanoFuenteTexto, 13),
    };
  }

  function mountBarraProgreso(widget, cfg, placement) {
    var uniqueId = NS + "-progreso-" + widget.id + "-" + placement;
    if (qs("#" + uniqueId)) return null;

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";
    container._placement = placement;

    if (placement === "product") {
      var t = findProductTarget("before-button");
      if (!t) {
        console.warn("[Nevux] No se encontró target para barra progreso en producto");
        return null;
      }
      if (cfg.posicionFicha === "encima-form") {
        t.node.parentNode.insertBefore(container, t.node);
      } else {
        t.node.parentNode.insertBefore(container, t.node.nextSibling);
      }
    } else if (placement === "floating") {
      container.classList.add(NS + "-progress-floating");
      document.body.appendChild(container);
    } else if (placement === "cart") {
      var checkoutBtn = findCartCheckoutButton();
      if (checkoutBtn && checkoutBtn.parentNode) {
        checkoutBtn.parentNode.insertBefore(container, checkoutBtn);
      } else {
        var cartTarget = findCartTarget();
        if (!cartTarget) return null;
        cartTarget.parentNode.insertBefore(container, cartTarget);
      }
    }

    console.log("[Nevux] Barra progreso montada en", placement);
    return container;
  }

  function buildBarraProgresoHtml(cfg, subtotal, placement) {
    var objetivosOrd = cfg.objetivos.slice().sort(function (a, b) { return a.monto - b.monto; });
    var montoMax = objetivosOrd[objetivosOrd.length - 1].monto;

    var proximoObj = null;
    for (var i = 0; i < objetivosOrd.length; i++) {
      if (subtotal < objetivosOrd[i].monto) { proximoObj = objetivosOrd[i]; break; }
    }
    var ultimoCumplido = null;
    for (var j = objetivosOrd.length - 1; j >= 0; j--) {
      if (subtotal >= objetivosOrd[j].monto) { ultimoCumplido = objetivosOrd[j]; break; }
    }

    var faltante = proximoObj ? Math.max(0, proximoObj.monto - subtotal) : 0;
    var porcentaje = Math.min(100, Math.max(0, (subtotal / montoMax) * 100));

    var textoHtml = "";
    if (proximoObj) {
      var t = escapeHtml(cfg.textoFaltante || "Te faltan {x} para {objetivo}");
      t = t
        .replace("{x}", '<strong style="color:' + cfg.colorMonto + ';font-weight:700;">' + formatMoneyInt(faltante) + '</strong>')
        .replace("{objetivo}", '<strong style="color:' + cfg.colorObjetivos + ';font-weight:700;">' + escapeHtml(proximoObj.nombre) + '</strong>');
      textoHtml = t;
    } else if (ultimoCumplido) {
      var tc = escapeHtml(cfg.textoCumplido || "¡{objetivo} desbloqueado! 🎉");
      tc = tc.replace("{objetivo}", '<strong style="color:' + cfg.colorObjetivos + ';font-weight:700;">' + escapeHtml(ultimoCumplido.nombre) + '</strong>');
      textoHtml = tc;
    }

    var hitsHtml = "";
    for (var k = 0; k < objetivosOrd.length; k++) {
      var o = objetivosOrd[k];
      var isLast = k === objetivosOrd.length - 1;
      var posPct = isLast ? 100 : (o.monto / montoMax) * 100;
      var cumplido = subtotal >= o.monto;
      var iconInner = getIconoSvgProgreso(o.icono, 12, "#ffffff");
      hitsHtml += '<div class="' + NS + '-progress-hit" style="left:' + posPct + '%;background:' + (cumplido ? cfg.colorBarraLlena : "#c9c9c9") + ';" title="' + escapeHtml(o.nombre) + '">' + iconInner + '</div>';
    }

    var listaHtml = "";
    if (cfg.formatoObjetivos === "lista") {
      var items = "";
      for (var m = 0; m < objetivosOrd.length; m++) {
        var oo = objetivosOrd[m];
        var cc = subtotal >= oo.monto;
        items += '<div style="display:flex;align-items:center;gap:6px;font-size:' + cfg.tamanoFuenteObjetivos + 'px;color:' + cfg.colorObjetivos + ';opacity:' + (cc ? "1" : "0.6") + ';margin-top:4px;">' +
          '<span style="width:12px;height:12px;border-radius:50%;background:' + (cc ? cfg.colorBarraLlena : "#c9c9c9") + ';display:inline-block;"></span>' +
          '<span style="font-weight:' + (cc ? "700" : "500") + ';">' + escapeHtml(oo.nombre) + ' — ' + formatMoneyInt(oo.monto) + '</span>' +
        '</div>';
      }
      listaHtml = '<div style="margin-top:10px;">' + items + '</div>';
    }

    var bgStyle = cfg.colorFondo === "transparent" ? "transparent" : cfg.colorFondo;

    return '' +
      '<div style="width:100%;background:' + bgStyle + ';border-radius:' + cfg.bordesRedondeados + 'px;padding:' + cfg.rellenoInterno + 'px ' + (cfg.rellenoInterno + 4) + 'px;box-sizing:border-box;">' +
        '<div style="color:' + cfg.colorTexto + ';font-size:' + cfg.tamanoFuenteTexto + 'px;line-height:1.4;margin-bottom:10px;">' + textoHtml + '</div>' +
        '<div class="' + NS + '-progress-wrap">' +
          '<div class="' + NS + '-progress-track" style="background:' + cfg.colorBarraVacia + ';">' +
            '<div class="' + NS + '-progress-fill" style="width:' + porcentaje + '%;background:' + cfg.colorBarraLlena + ';"></div>' +
            hitsHtml +
          '</div>' +
          listaHtml +
        '</div>' +
      '</div>';
  }

  function getIconoSvgProgreso(icono, size, color) {
    var attrs = 'width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
    switch (icono) {
      case "truck":
        return '<svg ' + attrs + '><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>';
      case "gift":
        return '<svg ' + attrs + '><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>';
      case "tag":
        return '<svg ' + attrs + '><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>';
      case "star":
        return '<svg ' + attrs + '><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      case "percent":
        return '<svg ' + attrs + '><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>';
      case "check":
        return '<svg ' + attrs + '><polyline points="20 6 9 17 4 12"/></svg>';
      case "shield":
        return '<svg ' + attrs + '><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
      case "bolt":
        return '<svg ' + attrs + '><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
      case "heart":
        return '<svg ' + attrs + '><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
      case "coffee":
        return '<svg ' + attrs + '><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>';
      case "hexagon":
        return '<svg ' + attrs + '><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>';
      case "card":
        return '<svg ' + attrs + '><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>';
      case "smile":
        return '<span style="font-size:' + (size + 2) + 'px;line-height:1;">😊</span>';
      case "none":
      default:
        return "";
    }
  }

  /* ═══════════════════════════════════════════
     RENDER BUNDLE PROMOCIONES
  ═══════════════════════════════════════════ */
  function renderBundlePromociones(widget) {
    if (pageType !== "product") return;
    var cfg = normalizeBundlePromocionesConfig(widget.config || {});
    if (!cfg.promociones || cfg.promociones.length === 0) return;
    mountBundlePromociones(widget, cfg);
  }

  function normalizeBundlePromocionesConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }

    var promos = Array.isArray(raw.promociones) ? raw.promociones : [];
    promos = promos.map(function (p) {
      return {
        tipo: String(p.tipo || "2x1"),
        formatoEtiqueta: p.formatoEtiqueta || "Lleva # paga #",
        subtitulo: p.subtitulo || "",
        badges: {
          envioGratis: !!(p.badges && p.badges.envioGratis),
          masVendido: !!(p.badges && p.badges.masVendido),
          personalizado: !!(p.badges && p.badges.personalizado),
          personalizadoTexto: (p.badges && p.badges.personalizadoTexto) || "",
        },
        ocultarComp1: p.ocultarComp1 === true,
        ocultarComp2: p.ocultarComp2 === true,
        agregarRegalo: p.agregarRegalo === true,
        marcarPorDefecto: p.marcarPorDefecto === true,
        ocultarUnidad: p.ocultarUnidad === true,
      };
    });

    var complementarios = Array.isArray(raw.complementarios) ? raw.complementarios : [];

    return {
      titulo: raw.titulo || "",
      textoBoton: raw.textoBoton || "Agregar al carrito",
      promociones: promos,
      complementarios: complementarios.slice(0, 2),
      complementariosDefault: raw.complementariosDefault === true,
      reemplazarBoton: raw.reemplazarBoton === true,
      colorBoton: raw.colorBoton || "#000000",
      botonDegradado: raw.botonDegradado === true,
      colorPrecio: raw.colorPrecio || "#000000",
      colorSubtitulo: raw.colorSubtitulo || "#059669",
      fondoSubtitulo: raw.fondoSubtitulo || "transparent",
      colorTextoRegalo: raw.colorTextoRegalo || "#000000",
      colorPrecioRegalo: raw.colorPrecioRegalo || "#16a34a",
      fondoRegalo: raw.fondoRegalo || "#f5fff7",
      colorBadgeEnvio: raw.colorBadgeEnvio || "#10B981",
      colorBadgePersonalizado: raw.colorBadgePersonalizado || "#F59E0B",
      colorBadgeMasVendido: raw.colorBadgeMasVendido || "#EF4444",
      colorUnidadSeleccionada: raw.colorUnidadSeleccionada || "#000000",
      bordeBoton: n(raw.bordeBoton, 25),
      bordeUnidad: n(raw.bordeUnidad, 8),
      tamanoEtiqueta: raw.tamanoEtiqueta || "16px",
      tamanoPrecio: raw.tamanoPrecio || "18px",
      tamanoSubtitulo: raw.tamanoSubtitulo || "14px",
      efectoBoton: raw.efectoBoton === "zoom" ? "zoom" : "sin-efecto",
      botonPulsante: raw.botonPulsante === true,
    };
  }

  function parsePromoRatio(tipo) {
    var m = String(tipo).toLowerCase().match(/(\d+)x(\d+)/);
    if (!m) return { lleva: 1, paga: 1 };
    return { lleva: parseInt(m[1], 10), paga: parseInt(m[2], 10) };
  }

  function formatEtiquetaPromo(formato, ratio) {
    var partes = String(formato).split("#");
    var out = "";
    var vals = [ratio.lleva, ratio.paga];
    var v = 0;
    for (var i = 0; i < partes.length; i++) {
      out += partes[i];
      if (i < partes.length - 1) {
        out += (v < vals.length ? vals[v] : "");
        v++;
      }
    }
    return out;
  }

  function mountBundlePromociones(widget, cfg) {
    var uniqueId = NS + "-bundle-" + widget.id;
    if (qs("#" + uniqueId)) return;

    var target = findProductTarget("before-button");
    if (!target) {
      console.warn("[Nevux] No se encontró target para bundle en producto");
      return;
    }

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    target.node.parentNode.insertBefore(container, target.node);

    if (cfg.reemplazarBoton && target.node) {
      target.node.style.display = "none";
    }

    var idxDefault = 0;
    for (var i = 0; i < cfg.promociones.length; i++) {
      if (cfg.promociones[i].marcarPorDefecto) { idxDefault = i; break; }
    }

    var state = {
      selectedIdx: idxDefault,
      comps: cfg.complementarios.map(function () { return cfg.complementariosDefault; }),
    };

    function render() {
      container.innerHTML = buildBundlePromocionesHtml(cfg, state);
      wireEvents();
    }

    function wireEvents() {
      qsa("." + NS + "-bundle-card", container).forEach(function (card) {
        card.addEventListener("click", function (e) {
          if (e.target && (e.target.tagName === "INPUT" || e.target.closest("." + NS + "-bundle-comp"))) return;
          var idx = parseInt(card.dataset.idx, 10);
          if (!isNaN(idx)) {
            state.selectedIdx = idx;
            render();
          }
        });
      });

      qsa("." + NS + "-bundle-comp input", container).forEach(function (chk) {
        chk.addEventListener("change", function () {
          var idx = parseInt(chk.dataset.compIdx, 10);
          if (!isNaN(idx)) {
            state.comps[idx] = chk.checked;
          }
        });
      });

      var btn = qs("." + NS + "-bundle-btn", container);
      if (btn) {
        btn.addEventListener("click", function () {
          var origForm = null;
          var origBtn = null;
          if (target.node) {
            if (target.node.tagName === "FORM") {
              origForm = target.node;
            } else {
              origForm = target.node.closest ? target.node.closest("form") : null;
              origBtn = target.node;
            }
          }
          if (origForm) {
            try {
              if (typeof origForm.requestSubmit === "function") {
                origForm.requestSubmit();
              } else {
                origForm.submit();
              }
            } catch (e) {
              var submitBtn = qs('button[type="submit"], input[type="submit"]', origForm);
              if (submitBtn) submitBtn.click();
            }
          } else if (origBtn) {
            origBtn.click();
          }
        });
      }
    }

    render();
    console.log("[Nevux] Bundle promociones montado");
  }

  function buildBundlePromocionesHtml(cfg, state) {
    var precio = detectProductPrice() || 0;

    var titleHtml = cfg.titulo
      ? '<div class="' + NS + '-bundle-title" style="color:#000;font-size:16px;">' + escapeHtml(cfg.titulo) + '</div>'
      : "";

    var cardsHtml = "";
    for (var i = 0; i < cfg.promociones.length; i++) {
      var p = cfg.promociones[i];
      if (p.ocultarUnidad) continue;

      var ratio = parsePromoRatio(p.tipo);
      var etiqueta = formatEtiquetaPromo(p.formatoEtiqueta, ratio);

      var precioTotalNormal = precio * ratio.lleva;
      var precioTotalPromo = precio * ratio.paga;

      var isSelected = i === state.selectedIdx;
      var borderColor = isSelected ? cfg.colorUnidadSeleccionada : "#e5e7eb";

      var badgesHtml = "";
      if (p.badges.envioGratis) {
        badgesHtml += '<span class="' + NS + '-bundle-badge" style="background:' + cfg.colorBadgeEnvio + ';">Envío gratis</span>';
      }
      if (p.badges.masVendido) {
        badgesHtml += '<span class="' + NS + '-bundle-badge" style="background:' + cfg.colorBadgeMasVendido + ';">Más vendido</span>';
      }
      if (p.badges.personalizado) {
        var txtPers = p.badges.personalizadoTexto || "Destacado";
        badgesHtml += '<span class="' + NS + '-bundle-badge" style="background:' + cfg.colorBadgePersonalizado + ';">' + escapeHtml(txtPers) + '</span>';
      }
      if (badgesHtml) {
        badgesHtml = '<div class="' + NS + '-bundle-badges">' + badgesHtml + '</div>';
      }

      var subtitleHtml = "";
      if (p.subtitulo) {
        var bgSub = (cfg.fondoSubtitulo && cfg.fondoSubtitulo !== "transparent")
          ? 'background:' + cfg.fondoSubtitulo + ';padding:2px 6px;border-radius:4px;display:inline-block;'
          : "";
        subtitleHtml = '<div class="' + NS + '-bundle-subtitle" style="color:' + cfg.colorSubtitulo + ';font-size:' + cfg.tamanoSubtitulo + ';' + bgSub + '">' + escapeHtml(p.subtitulo) + '</div>';
      }

      var compsHtml = "";
      var compsToShow = [];
      for (var c = 0; c < cfg.complementarios.length; c++) {
        var oculto = (c === 0 && p.ocultarComp1) || (c === 1 && p.ocultarComp2);
        if (!oculto && cfg.complementarios[c]) compsToShow.push({ idx: c, prod: cfg.complementarios[c] });
      }
      if (compsToShow.length > 0) {
        var compsInner = "";
        for (var cc = 0; cc < compsToShow.length; cc++) {
          var comp = compsToShow[cc];
          var chk = state.comps[comp.idx] ? "checked" : "";
          var nombreComp = comp.prod.name || comp.prod.nombre || ("Producto " + (comp.idx + 1));
          compsInner += '<label class="' + NS + '-bundle-comp"><input type="checkbox" data-comp-idx="' + comp.idx + '" ' + chk + '/>' + escapeHtml(nombreComp) + '</label>';
        }
        compsHtml = '<div class="' + NS + '-bundle-comps">' + compsInner + '</div>';
      }

      var giftHtml = "";
      if (p.agregarRegalo) {
        giftHtml = '<div class="' + NS + '-bundle-gift" style="background:' + cfg.fondoRegalo + ';color:' + cfg.colorTextoRegalo + ';border-radius:6px;">' +
          '<span class="' + NS + '-bundle-gift-label">🎁 Producto de regalo</span>' +
          '<span style="color:' + cfg.colorPrecioRegalo + ';font-weight:700;">Gratis</span>' +
        '</div>';
      }

      cardsHtml +=
        '<div class="' + NS + '-bundle-card' + (isSelected ? ' selected' : '') + '" data-idx="' + i + '" style="border-color:' + borderColor + ';border-radius:' + cfg.bordeUnidad + 'px;">' +
          '<div style="display:flex;align-items:center;gap:12px;width:100%;">' +
            '<div class="' + NS + '-bundle-radio"><div class="' + NS + '-bundle-radio-dot"></div></div>' +
            '<div class="' + NS + '-bundle-info">' +
              '<div class="' + NS + '-bundle-label" style="font-size:' + cfg.tamanoEtiqueta + ';">' + escapeHtml(etiqueta) + '</div>' +
              subtitleHtml +
              badgesHtml +
            '</div>' +
            '<div class="' + NS + '-bundle-prices">' +
              (ratio.lleva !== ratio.paga ? '<span class="' + NS + '-bundle-price-old">' + formatMoney(precioTotalNormal) + '</span>' : "") +
              '<span class="' + NS + '-bundle-price-new" style="color:' + cfg.colorPrecio + ';font-size:' + cfg.tamanoPrecio + ';">' + formatMoney(precioTotalPromo) + '</span>' +
            '</div>' +
          '</div>' +
          (compsHtml || giftHtml ? '<div style="width:100%;">' + compsHtml + giftHtml + '</div>' : "") +
        '</div>';
    }

    var btnBg = cfg.botonDegradado
      ? 'background:linear-gradient(135deg, ' + cfg.colorBoton + ' 0%, ' + cfg.colorBoton + 'cc 100%);'
      : 'background:' + cfg.colorBoton + ';';
    var btnClass = NS + "-bundle-btn";
    if (cfg.efectoBoton === "zoom") btnClass += " zoom";
    if (cfg.botonPulsante) btnClass += " pulse";

    var btnHtml = '<button type="button" class="' + btnClass + '" style="' + btnBg + 'color:#fff;font-size:' + cfg.tamanoEtiqueta + ';border-radius:' + cfg.bordeBoton + 'px;">' + escapeHtml(cfg.textoBoton || "Agregar al carrito") + '</button>';

    var infoHtml = !cfg.reemplazarBoton
      ? '<div class="' + NS + '-bundle-info-note"><span style="opacity:0.7;">ⓘ</span><span>El formulario original de Tiendanube permanecerá visible y funcional.</span></div>'
      : "";

    return '<div class="' + NS + '-bundle">' +
      titleHtml +
      cardsHtml +
      btnHtml +
      infoHtml +
    '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER BUNDLE DE CANTIDAD
  ═══════════════════════════════════════════ */
  function renderBundleCantidad(widget) {
    if (pageType !== "product") return;
    var cfg = normalizeBundleCantidadConfig(widget.config || {});
    if (!cfg.unidades || cfg.unidades.length === 0) return;
    mountBundleCantidad(widget, cfg);
  }

  function normalizeBundleCantidadConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }

    var unidadesRaw = Array.isArray(raw.unidades) ? raw.unidades : [];
    var unidadesNorm = [];
    for (var i = 0; i < 5; i++) {
      var u = unidadesRaw[i] || {};
      unidadesNorm.push({
        subtitulo: u.subtitulo || "",
        descuento: parseFloat(u.descuento) || 0,
        badgeEnvioGratis: u.badgeEnvioGratis === true,
        badgeMasVendido: u.badgeMasVendido === true,
        badgePersonalizado: u.badgePersonalizado === true,
        ocultar: u.ocultar === true,
        porDefecto: u.porDefecto === true,
        ocultarComp1: u.ocultarComp1 === true,
        ocultarComp2: u.ocultarComp2 === true,
        agregarRegalo: u.agregarRegalo === true,
      });
    }

    return {
      titulo: raw.titulo || "",
      cantidadUnidades: n(raw.cantidadUnidades, 2),
      etiqueta: raw.etiqueta || "Lleva #",
      mostrarPrecio: raw.mostrarPrecio === "individual" ? "individual" : "total",
      textoBoton: raw.textoBoton || "",
      unidades: unidadesNorm,
      producto1: raw.producto1 || null,
      producto2: raw.producto2 || null,
      compDefault: raw.compDefault === true,
      reemplazarBoton: raw.reemplazarBoton === true,
      colorBoton: raw.colorBoton || "#000000",
      botonDegradado: raw.botonDegradado === true,
      colorBoton2: raw.colorBoton2 || "#3B82F6",
      colorPrecio: raw.colorPrecio || "#000000",
      colorSubtitulos: raw.colorSubtitulos || "#059669",
      fondoSubtitulo: raw.fondoSubtitulo || "",
      colorTextoRegalo: raw.colorTextoRegalo || "#000000",
      colorPrecioRegalo: raw.colorPrecioRegalo || "#16a34a",
      fondoRegalo: raw.fondoRegalo || "#f5fff7",
      colorBadgeEnvio: raw.colorBadgeEnvio || "#10B981",
      colorBadgePersonalizado: raw.colorBadgePersonalizado || "#F59E0B",
      colorBadgeMasVendido: raw.colorBadgeMasVendido || "#EF4444",
      colorUnidadSeleccionada: raw.colorUnidadSeleccionada || "#170c0e",
      bordeBoton: n(raw.bordeBoton, 25),
      bordeUnidad: n(raw.bordeUnidad, 8),
      fuenteEtiqueta: n(raw.fuenteEtiqueta, 16),
      fuentePrecio: n(raw.fuentePrecio, 18),
      fuenteSubtitulo: n(raw.fuenteSubtitulo, 14),
      efectoBoton: raw.efectoBoton === "zoom" ? "zoom" : "sin-efecto",
      pulsante: raw.pulsante === true,
    };
  }

  function formatEtiquetaCantidad(etiqueta, cantidad) {
    return String(etiqueta).replace(/#/g, String(cantidad));
  }

  function mountBundleCantidad(widget, cfg) {
    var uniqueId = NS + "-bundlecant-" + widget.id;
    if (qs("#" + uniqueId)) return;

    var target = findProductTarget("before-button");
    if (!target) {
      console.warn("[Nevux] No se encontró target para bundle cantidad en producto");
      return;
    }

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    target.node.parentNode.insertBefore(container, target.node);

    if (cfg.reemplazarBoton && target.node) {
      target.node.style.display = "none";
    }

    var cantidadReal = Math.max(2, Math.min(5, cfg.cantidadUnidades || 2));
    var idxDefault = -1;
    for (var i = 0; i < cantidadReal; i++) {
      if (cfg.unidades[i] && cfg.unidades[i].porDefecto && !cfg.unidades[i].ocultar) {
        idxDefault = i; break;
      }
    }
    if (idxDefault === -1) {
      for (var j = 0; j < cantidadReal; j++) {
        if (cfg.unidades[j] && !cfg.unidades[j].ocultar) { idxDefault = j; break; }
      }
    }

    var state = {
      selectedIdx: idxDefault,
      comp1: cfg.compDefault,
      comp2: cfg.compDefault,
    };

    function render() {
      container.innerHTML = buildBundleCantidadHtml(cfg, state, cantidadReal);
      wireEvents();
    }

    function wireEvents() {
      qsa("." + NS + "-bundle-card", container).forEach(function (card) {
        card.addEventListener("click", function (e) {
          if (e.target && (e.target.tagName === "INPUT" || e.target.closest("." + NS + "-bundle-comp"))) return;
          var idx = parseInt(card.dataset.idx, 10);
          if (!isNaN(idx)) {
            state.selectedIdx = idx;
            render();
          }
        });
      });

      qsa("." + NS + "-bundle-comp input", container).forEach(function (chk) {
        chk.addEventListener("change", function () {
          var idx = parseInt(chk.dataset.compIdx, 10);
          if (idx === 0) state.comp1 = chk.checked;
          if (idx === 1) state.comp2 = chk.checked;
        });
      });

      var btn = qs("." + NS + "-bundle-btn", container);
      if (btn) {
        btn.addEventListener("click", function () {
          var origForm = null;
          var origBtn = null;
          if (target.node) {
            if (target.node.tagName === "FORM") {
              origForm = target.node;
            } else {
              origForm = target.node.closest ? target.node.closest("form") : null;
              origBtn = target.node;
            }
          }
          if (origForm) {
            try {
              if (typeof origForm.requestSubmit === "function") {
                origForm.requestSubmit();
              } else {
                origForm.submit();
              }
            } catch (e) {
              var submitBtn = qs('button[type="submit"], input[type="submit"]', origForm);
              if (submitBtn) submitBtn.click();
            }
          } else if (origBtn) {
            origBtn.click();
          }
        });
      }
    }

    render();
    console.log("[Nevux] Bundle cantidad montado");
  }

  function buildBundleCantidadHtml(cfg, state, cantidadReal) {
    var precio = detectProductPrice() || 0;

    var titleHtml = cfg.titulo
      ? '<div class="' + NS + '-bundle-title" style="color:#000;font-size:16px;text-align:center;">' + escapeHtml(cfg.titulo) + '</div>'
      : "";

    var cardsHtml = "";
    for (var i = 0; i < cantidadReal; i++) {
      var u = cfg.unidades[i];
      if (!u || u.ocultar) continue;

      var cantidad = i + 1;
      var etiqueta = formatEtiquetaCantidad(cfg.etiqueta, cantidad);
      var descuento = parseFloat(u.descuento) || 0;

      var precioUnitario = precio * (1 - descuento / 100);
      var precioTotalOriginal = precio * cantidad;
      var precioTotalConDesc = precioUnitario * cantidad;

      var mostrarTachado = descuento > 0;
      var precioMostrar = cfg.mostrarPrecio === "individual" ? precioUnitario : precioTotalConDesc;
      var precioTachadoMostrar = cfg.mostrarPrecio === "individual" ? precio : precioTotalOriginal;

      var isSelected = i === state.selectedIdx;
      var borderColor = isSelected ? cfg.colorUnidadSeleccionada : "#e5e7eb";

      var badgesHtml = "";
      if (u.badgeEnvioGratis) {
        badgesHtml += '<span class="' + NS + '-bundle-badge" style="background:' + cfg.colorBadgeEnvio + ';">Envío gratis</span>';
      }
      if (u.badgeMasVendido) {
        badgesHtml += '<span class="' + NS + '-bundle-badge" style="background:' + cfg.colorBadgeMasVendido + ';">Más vendido</span>';
      }
      if (u.badgePersonalizado) {
        badgesHtml += '<span class="' + NS + '-bundle-badge" style="background:' + cfg.colorBadgePersonalizado + ';">Personalizado</span>';
      }
      if (badgesHtml) {
        badgesHtml = '<div class="' + NS + '-bundle-badges">' + badgesHtml + '</div>';
      }

      var subtitleHtml = "";
      if (u.subtitulo) {
        var bgSub = (cfg.fondoSubtitulo && cfg.fondoSubtitulo !== "transparent" && cfg.fondoSubtitulo !== "")
          ? 'background:' + cfg.fondoSubtitulo + ';padding:2px 6px;border-radius:4px;display:inline-block;'
          : "";
        subtitleHtml = '<div class="' + NS + '-bundle-subtitle" style="color:' + cfg.colorSubtitulos + ';font-size:' + cfg.fuenteSubtitulo + 'px;' + bgSub + '">' + escapeHtml(u.subtitulo) + '</div>';
      }

      var compsHtml = "";
      var compsToShow = [];
      if (cfg.producto1 && !u.ocultarComp1) {
        compsToShow.push({ idx: 0, prod: cfg.producto1, checked: state.comp1 });
      }
      if (cfg.producto2 && !u.ocultarComp2) {
        compsToShow.push({ idx: 1, prod: cfg.producto2, checked: state.comp2 });
      }
      if (compsToShow.length > 0) {
        var compsInner = "";
        for (var cc = 0; cc < compsToShow.length; cc++) {
          var comp = compsToShow[cc];
          var chk = comp.checked ? "checked" : "";
          var nombreComp = comp.prod.name || comp.prod.nombre || ("Producto " + (comp.idx + 1));
          compsInner += '<label class="' + NS + '-bundle-comp"><input type="checkbox" data-comp-idx="' + comp.idx + '" ' + chk + '/>' + escapeHtml(nombreComp) + '</label>';
        }
        compsHtml = '<div class="' + NS + '-bundle-comps">' + compsInner + '</div>';
      }

      var giftHtml = "";
      if (u.agregarRegalo) {
        giftHtml = '<div class="' + NS + '-bundle-gift" style="background:' + cfg.fondoRegalo + ';color:' + cfg.colorTextoRegalo + ';border-radius:6px;">' +
          '<span class="' + NS + '-bundle-gift-label">🎁 Producto de regalo</span>' +
          '<span style="color:' + cfg.colorPrecioRegalo + ';font-weight:700;">GRATIS</span>' +
        '</div>';
      }

      cardsHtml +=
        '<div class="' + NS + '-bundle-card' + (isSelected ? ' selected' : '') + '" data-idx="' + i + '" style="border-color:' + borderColor + ';border-radius:' + cfg.bordeUnidad + 'px;">' +
          '<div style="display:flex;align-items:center;gap:12px;width:100%;">' +
            '<div class="' + NS + '-bundle-radio" style="border-color:' + (isSelected ? cfg.colorUnidadSeleccionada : "#9ca3af") + ';">' +
              '<div class="' + NS + '-bundle-radio-dot" style="background:' + cfg.colorUnidadSeleccionada + ';"></div>' +
            '</div>' +
            '<div class="' + NS + '-bundle-info">' +
              '<div class="' + NS + '-bundle-label" style="font-size:' + cfg.fuenteEtiqueta + 'px;">' + escapeHtml(etiqueta) + '</div>' +
              subtitleHtml +
              badgesHtml +
            '</div>' +
            '<div class="' + NS + '-bundle-prices">' +
              (mostrarTachado ? '<span class="' + NS + '-bundle-price-old">' + formatMoney(precioTachadoMostrar) + '</span>' : "") +
              '<span class="' + NS + '-bundle-price-new" style="color:' + cfg.colorPrecio + ';font-size:' + cfg.fuentePrecio + 'px;">' + formatMoney(precioMostrar) + '</span>' +
            '</div>' +
          '</div>' +
          (compsHtml || giftHtml ? '<div style="width:100%;">' + compsHtml + giftHtml + '</div>' : "") +
        '</div>';
    }

    var btnBg = cfg.botonDegradado
      ? 'background:linear-gradient(90deg, ' + cfg.colorBoton + ' 0%, ' + cfg.colorBoton2 + ' 100%);'
      : 'background:' + cfg.colorBoton + ';';
    var btnClass = NS + "-bundle-btn";
    if (cfg.efectoBoton === "zoom") btnClass += " zoom";
    if (cfg.pulsante) btnClass += " pulse";

    var textoBoton = cfg.textoBoton && cfg.textoBoton.trim() !== "" ? cfg.textoBoton : "Agregar al carrito";
    var btnHtml = '<button type="button" class="' + btnClass + '" style="' + btnBg + 'color:#fff;font-size:16px;border-radius:' + cfg.bordeBoton + 'px;">' + escapeHtml(textoBoton) + '</button>';

    var infoHtml = !cfg.reemplazarBoton
      ? '<div class="' + NS + '-bundle-info-note"><span style="opacity:0.7;">ⓘ</span><span>El formulario original de Tiendanube permanecerá visible y funcional.</span></div>'
      : "";

    return '<div class="' + NS + '-bundle">' +
      titleHtml +
      cardsHtml +
      btnHtml +
      infoHtml +
    '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER CAJA DE OPINIONES
  ═══════════════════════════════════════════ */
  function renderCajaOpiniones(widget) {
    if (pageType !== "product") return;
    var cfg = normalizeCajaOpinionesConfig(widget.config || {});
    var opiniones = (cfg.opiniones || []).filter(function (o) {
      return o && ((o.nombre && o.nombre.trim().length > 0) || (o.texto && o.texto.trim().length > 0));
    });
    if (opiniones.length === 0) return;
    cfg.opiniones = opiniones;
    mountCajaOpiniones(widget, cfg);
  }

  function normalizeCajaOpinionesConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    var op = Array.isArray(raw.opiniones) ? raw.opiniones : [];
    op = op.map(function (o) {
      return {
        nombre: o.nombre || "",
        estrellas: Math.max(1, Math.min(5, parseInt(o.estrellas, 10) || 5)),
        texto: o.texto || "",
        foto: o.foto || "",
        compraVerificada: o.compraVerificada === true,
      };
    });
    return {
      opiniones: op,
      colorFondo: raw.colorFondo || "#f7f7f7",
      colorTexto: raw.colorTexto || "#333333",
      colorEstrellas: raw.colorEstrellas || "#f5b301",
      mostrarBorde: raw.mostrarBorde === true,
      colorBorde: raw.colorBorde || "#cccccc",
      fuenteNombre: n(raw.fuenteNombre, 16),
      fuenteOpinion: n(raw.fuenteOpinion, 15),
      bordeRedondeado: n(raw.bordeRedondeado, 10),
      padding: n(raw.padding, 20),
      tamanoAvatar: n(raw.tamanoAvatar, 44),
    };
  }

  function getOpinionInitial(nombre) {
    var n = (nombre || "").trim();
    if (!n) return "?";
    return n.charAt(0).toUpperCase();
  }

  function getOpinionAvatarBg(nombre) {
    var palette = [
      "#DBEAFE", "#FCE7F3", "#DCFCE7", "#FEF3C7",
      "#EDE9FE", "#FFE4E6", "#CFFAFE", "#FEE2E2"
    ];
    var n = (nombre || "").trim();
    if (!n) return "#E5E7EB";
    var sum = 0;
    for (var i = 0; i < n.length; i++) sum += n.charCodeAt(i);
    return palette[sum % palette.length];
  }

  function getOpinionAvatarColor(nombre) {
    var palette = [
      "#1E40AF", "#9D174D", "#166534", "#92400E",
      "#5B21B6", "#9F1239", "#155E75", "#991B1B"
    ];
    var n = (nombre || "").trim();
    if (!n) return "#374151";
    var sum = 0;
    for (var i = 0; i < n.length; i++) sum += n.charCodeAt(i);
    return palette[sum % palette.length];
  }

  function mountCajaOpiniones(widget, cfg) {
    var uniqueId = NS + "-opiniones-" + widget.id;
    if (qs("#" + uniqueId)) return;

    var target = findProductTarget("before-button");
    if (!target) {
      console.warn("[Nevux] No se encontró target para caja de opiniones en producto");
      return;
    }

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (target.node.parentNode) {
      target.node.parentNode.insertBefore(container, target.node.nextSibling);
    } else {
      return;
    }

    container.innerHTML = buildCajaOpinionesHtml(cfg);
    console.log("[Nevux] Caja de opiniones montada");
  }

  function buildCajaOpinionesHtml(cfg) {
    var borde = cfg.mostrarBorde ? "1px solid " + cfg.colorBorde : "none";
    var avatarSize = cfg.tamanoAvatar || 44;
    var avatarFontSize = Math.round(avatarSize * 0.42);
    var starSize = Math.max(14, Math.round(cfg.fuenteNombre * 0.95));

    var cardsHtml = "";
    for (var i = 0; i < cfg.opiniones.length; i++) {
      var o = cfg.opiniones[i];
      var nombre = (o.nombre || "").trim() || "Cliente";
      var texto = (o.texto || "").trim();

      var avatarHtml = "";
      if (o.foto) {
        avatarHtml = '<div class="' + NS + '-opiniones-avatar" style="width:' + avatarSize + 'px;height:' + avatarSize + 'px;">' +
          '<img src="' + o.foto + '" alt="' + escapeHtml(nombre) + '"/>' +
        '</div>';
      } else {
        var bg = getOpinionAvatarBg(nombre);
        var color = getOpinionAvatarColor(nombre);
        var initial = getOpinionInitial(nombre);
        avatarHtml = '<div class="' + NS + '-opiniones-avatar" style="width:' + avatarSize + 'px;height:' + avatarSize + 'px;background:' + bg + ';color:' + color + ';font-size:' + avatarFontSize + 'px;">' +
          escapeHtml(initial) +
        '</div>';
      }

      var starsHtml = "";
      for (var s = 1; s <= 5; s++) {
        var starColor = s <= o.estrellas ? cfg.colorEstrellas : "#E5E7EB";
        starsHtml += '<span class="' + NS + '-opiniones-star" style="color:' + starColor + ';font-size:' + starSize + 'px;">★</span>';
      }

      var verifiedHtml = o.compraVerificada
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="#3B82F6" style="flex-shrink:0;"><path d="M12 2l2.09 2.26L17 4l.74 2.91L20 8l-1.26 2.5L20 13l-2.26 1.09L17 17l-2.91-.74L12 18l-2.5-1.26L7 17l-.74-2.91L4 13l1.26-2.5L4 8l2.26-1.09L7 4l2.91.74L12 2z"/><path d="M9 12l2 2 4-4" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : "";

      var textoHtml = texto
        ? '<div class="' + NS + '-opiniones-text" style="font-size:' + cfg.fuenteOpinion + 'px;color:' + cfg.colorTexto + ';">' + escapeHtml(texto) + '</div>'
        : "";

      cardsHtml +=
        '<div class="' + NS + '-opiniones-card" style="background:' + cfg.colorFondo + ';color:' + cfg.colorTexto + ';border-radius:' + cfg.bordeRedondeado + 'px;padding:' + cfg.padding + 'px;border:' + borde + ';">' +
          '<div class="' + NS + '-opiniones-top">' +
            avatarHtml +
            '<div class="' + NS + '-opiniones-name-stars">' +
              '<span class="' + NS + '-opiniones-name" style="font-size:' + cfg.fuenteNombre + 'px;color:' + cfg.colorTexto + ';">' + escapeHtml(nombre) + '</span>' +
              '<span class="' + NS + '-opiniones-stars">' + starsHtml + '</span>' +
              verifiedHtml +
            '</div>' +
          '</div>' +
          textoHtml +
        '</div>';
    }

    return '<div class="' + NS + '-opiniones-list">' + cardsHtml + '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER INFORMACIÓN DE DESPACHO
  ═══════════════════════════════════════════ */
  function renderInformacionDespacho(widget) {
    if (pageType !== "product") return;
    var cfg = normalizeInformacionDespachoConfig(widget.config || {});
    mountInformacionDespacho(widget, cfg);
  }

  function normalizeInformacionDespachoConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    var dias = raw.diasDespacho || {};
    return {
      horaCorte: raw.horaCorte || "18:00",
      diasDespacho: {
        lun: dias.lun !== false,
        mar: dias.mar !== false,
        mie: dias.mie !== false,
        jue: dias.jue !== false,
        vie: dias.vie !== false,
        sab: dias.sab !== false,
        dom: dias.dom === true,
      },
      ocultarSiPasoCorte: raw.ocultarSiPasoCorte === true,
      agregarBadge: raw.agregarBadge === true,
      posicion: raw.posicion === "antes-descripcion" ? "antes-descripcion" : "encima-form",
      icono: raw.icono || "circulo",
      efecto: raw.efecto === "aureola" ? "aureola" : (raw.efecto === "sin-efecto" ? "sin-efecto" : "zoom"),
      aplicarEfectoA: raw.aplicarEfectoA === "mensaje-completo" ? "mensaje-completo" : "solo-icono",
      tamanoFuente: n(raw.tamanoFuente, 15),
      estiloTexto: raw.estiloTexto === "normal" ? "normal" : "negrita",
      colorFondo: raw.colorFondo || "#10b981",
      fondoDegradado: raw.fondoDegradado === true,
      colorTexto: raw.colorTexto || "#ffffff",
      colorBadge: raw.colorBadge && String(raw.colorBadge).trim() !== "" ? raw.colorBadge : "rgba(0,0,0,0.18)",
      colorTextoBadge: raw.colorTextoBadge || "#ffffff",
      bordesRedondeados: n(raw.bordesRedondeados, 12),
      paddingInterno: n(raw.paddingInterno, 10),
      activarBorde: raw.activarBorde === true,
    };
  }

  function mountInformacionDespacho(widget, cfg) {
    var uniqueId = NS + "-despacho-" + widget.id;
    if (qs("#" + uniqueId)) return;

    var target = findProductTarget("before-button");
    if (!target) {
      console.warn("[Nevux] No se encontró target para info despacho en producto");
      return;
    }

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (cfg.posicion === "antes-descripcion") {
      if (target.node.parentNode) {
        target.node.parentNode.insertBefore(container, target.node.nextSibling);
      } else {
        return;
      }
    } else {
      target.node.parentNode.insertBefore(container, target.node);
    }

    function refresh() {
      var info = calculateDespachoInfo(cfg);
      if (info === null) {
        container.style.display = "none";
        return;
      }
      container.style.display = "";
      container.innerHTML = buildInformacionDespachoHtml(cfg, info);
    }

    refresh();
    setInterval(refresh, 60 * 1000);

    console.log("[Nevux] Info despacho montado");
  }

  function calculateDespachoInfo(cfg) {
    var diasArr = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
    var nombresLargos = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];

    var now = new Date();
    var currentDay = now.getDay();

    var horaCorteParts = String(cfg.horaCorte || "18:00").split(":");
    var horaCorteH = parseInt(horaCorteParts[0], 10) || 18;
    var horaCorteM = parseInt(horaCorteParts[1], 10) || 0;

    var corte = new Date(now.getFullYear(), now.getMonth(), now.getDate(), horaCorteH, horaCorteM, 0);
    var msLeft = corte.getTime() - now.getTime();

    var currentDayKey = diasArr[currentDay];
    var isHoyDespacho = cfg.diasDespacho[currentDayKey] === true;

    if (isHoyDespacho && msLeft > 0) {
      var totalMin = Math.floor(msLeft / 60000);
      var h = Math.floor(totalMin / 60);
      var m = totalMin % 60;
      var timeLeft;
      if (h > 0) {
        timeLeft = h + "h " + m + "m";
      } else {
        timeLeft = m + "m";
      }
      return {
        dayLabel: "HOY",
        timeLeft: timeLeft,
        showRight: true,
      };
    }

    if (cfg.ocultarSiPasoCorte === true) {
      return null;
    }

    var found = null;
    for (var i = 1; i <= 7; i++) {
      var idx = (currentDay + i) % 7;
      var key = diasArr[idx];
      if (cfg.diasDespacho[key] === true) {
        found = { idx: idx, offset: i };
        break;
      }
    }

    if (!found) {
      return null;
    }

    var label;
    if (found.offset === 1) {
      label = "MAÑANA";
    } else {
      label = nombresLargos[found.idx];
    }

    return {
      dayLabel: label,
      timeLeft: null,
      showRight: false,
    };
  }

  function getDespachoIconSvg(tipo, size, colorTexto) {
    switch (tipo) {
      case "circulo":
        return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="#10B981"><circle cx="12" cy="12" r="10"/></svg>';
      case "corazon":
        return '<span style="font-size:' + (size + 2) + 'px;line-height:1;">❤️</span>';
      case "alerta":
        return '<span style="font-size:' + (size + 2) + 'px;line-height:1;">⚠️</span>';
      case "emoji":
        return '<span style="font-size:' + (size + 4) + 'px;line-height:1;">✏️</span>';
      case "nada":
      default:
        return "";
    }
  }

  function buildInformacionDespachoHtml(cfg, info) {
    var fontWeight = cfg.estiloTexto === "negrita" ? 700 : 400;
    var fontSize = cfg.tamanoFuente || 15;

    var background = cfg.fondoDegradado
      ? "linear-gradient(135deg, " + cfg.colorFondo + " 0%, " + cfg.colorFondo + "dd 100%)"
      : cfg.colorFondo;

    var border = cfg.activarBorde ? "1px solid " + cfg.colorTexto + "33" : "none";

    var badgeBg = cfg.colorBadge;

    var efectoAnim =
      cfg.efecto === "aureola" ? NS + "-aureolaPulse 2s ease-in-out infinite" :
      cfg.efecto === "zoom" ? NS + "-zoomEffect 2s ease-in-out infinite" :
      "none";

    var aplicarASoloIcono = cfg.aplicarEfectoA === "solo-icono";
    var animacionCard = !aplicarASoloIcono ? efectoAnim : "none";
    var animacionIcono = aplicarASoloIcono ? efectoAnim : "none";

    var iconoSize = fontSize + 2;
    var iconoSvg = getDespachoIconSvg(cfg.icono, iconoSize, cfg.colorTexto);
    var iconoHtml = iconoSvg
      ? '<div class="' + NS + '-despacho-icon" style="animation:' + animacionIcono + ';">' + iconoSvg + '</div>'
      : "";

    var textoPrincipal = "Comprando ahora tu pedido se despacha";
    var dayBadgeFontSize = Math.max(11, fontSize - 3);

    var dayBadgeHtml = '<span class="' + NS + '-despacho-day-badge" style="background:' + badgeBg + ';color:' + cfg.colorTextoBadge + ';font-size:' + dayBadgeFontSize + 'px;">' +
      escapeHtml(info.dayLabel) +
    '</span>';

    var rightHtml = "";
    if (info.showRight && info.timeLeft) {
      var rightLabelSize = Math.max(10, fontSize - 5);
      var rightValueSize = Math.max(14, fontSize);
      rightHtml = '<div class="' + NS + '-despacho-right" style="background:' + badgeBg + ';color:' + cfg.colorTextoBadge + ';">' +
        '<span class="' + NS + '-despacho-right-label" style="font-size:' + rightLabelSize + 'px;">Te quedan</span>' +
        '<span class="' + NS + '-despacho-right-value" style="font-size:' + rightValueSize + 'px;">' + escapeHtml(info.timeLeft) + '</span>' +
      '</div>';
    }

    return '' +
      '<div class="' + NS + '-despacho-box" style="background:' + background + ';color:' + cfg.colorTexto + ';border-radius:' + cfg.bordesRedondeados + 'px;padding:' + (cfg.paddingInterno + 4) + 'px ' + (cfg.paddingInterno + 8) + 'px;border:' + border + ';animation:' + animacionCard + ';">' +
        '<div class="' + NS + '-despacho-left">' +
          iconoHtml +
          '<div class="' + NS + '-despacho-text-wrap">' +
            '<span class="' + NS + '-despacho-text" style="font-size:' + fontSize + 'px;font-weight:' + fontWeight + ';color:' + cfg.colorTexto + ';">' + escapeHtml(textoPrincipal) + '</span>' +
            dayBadgeHtml +
          '</div>' +
        '</div>' +
        rightHtml +
      '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER INFORMACIÓN DE ENVÍO
  ═══════════════════════════════════════════ */
  function renderInformacionEnvio(widget) {
    if (pageType !== "product") return;
    var cfg = normalizeInformacionEnvioConfig(widget.config || {});
    mountInformacionEnvio(widget, cfg);
  }

  function normalizeInformacionEnvioConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      diasHastaEnvio: Math.max(0, n(raw.diasHastaEnvio, 1)),
      diasParaEntrega: Math.max(0, n(raw.diasParaEntrega, 2)),
      horaCorte: raw.horaCorte || "18:00",
      mostrarHoraLimite: raw.mostrarHoraLimite === true,
      mostrarRangoEntrega: raw.mostrarRangoEntrega === true,
      mostrarFechasAprox: raw.mostrarFechasAprox === true,
      noDespacharSabados: raw.noDespacharSabados === true,
      tipoIconos: raw.tipoIconos === "svg" ? "svg" : "emojis",
      colorFondo: raw.colorFondo || "#d9f5e4",
      colorTexto: raw.colorTexto || "#1f6b4e",
      colorBadgeFondo: raw.colorBadgeFondo || "#dc3545",
      colorBadgeTexto: raw.colorBadgeTexto || "#ffffff",
      activarBorde: raw.activarBorde === true,
      tamanoLabel: n(raw.tamanoLabel, 14),
      tamanoDia: n(raw.tamanoDia, 13),
      bordesRedondeados: n(raw.bordesRedondeados, 10),
      paddingInterno: n(raw.paddingInterno, 15),
    };
  }

  function mountInformacionEnvio(widget, cfg) {
    var uniqueId = NS + "-envio-info-" + widget.id;
    if (qs("#" + uniqueId)) return;

    var target = findProductTarget("before-button");
    if (!target) {
      console.warn("[Nevux] No se encontró target para info envío en producto");
      return;
    }

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (target.node.parentNode) {
      target.node.parentNode.insertBefore(container, target.node.nextSibling);
    } else {
      return;
    }

    function refresh() {
      var info = calculateEnvioInfo(cfg);
      container.innerHTML = buildInformacionEnvioHtml(cfg, info);
    }

    refresh();
    setInterval(refresh, 60 * 1000);

    console.log("[Nevux] Info envío montado");
  }

  function calculateEnvioInfo(cfg) {
    var now = new Date();

    var horaCorteParts = String(cfg.horaCorte || "18:00").split(":");
    var horaCorteH = parseInt(horaCorteParts[0], 10) || 18;
    var horaCorteM = parseInt(horaCorteParts[1], 10) || 0;

    var corte = new Date(now.getFullYear(), now.getMonth(), now.getDate(), horaCorteH, horaCorteM, 0);
    var pasoCorte = now.getTime() >= corte.getTime();

    var badgeAntes = null;
    if (cfg.mostrarHoraLimite && !pasoCorte) {
      var hh = String(horaCorteH).padStart(2, "0");
      var mm = String(horaCorteM).padStart(2, "0");
      badgeAntes = "ANTES DE LAS " + hh + ":" + mm;
    }

    var envioDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    envioDate.setDate(envioDate.getDate() + cfg.diasHastaEnvio + (pasoCorte ? 1 : 0));

    if (cfg.noDespacharSabados) {
      var dow = envioDate.getDay();
      if (dow === 6) {
        envioDate.setDate(envioDate.getDate() + 2);
      } else if (dow === 0) {
        envioDate.setDate(envioDate.getDate() + 1);
      }
    }

    var entregaDate = new Date(envioDate.getFullYear(), envioDate.getMonth(), envioDate.getDate());
    entregaDate.setDate(entregaDate.getDate() + cfg.diasParaEntrega);

    var envioLabel = formatFechaRelativaOCorta(envioDate, now);
    var entregaLabel;
    if (cfg.mostrarRangoEntrega) {
      var entregaDate2 = new Date(entregaDate.getFullYear(), entregaDate.getMonth(), entregaDate.getDate());
      entregaDate2.setDate(entregaDate2.getDate() + 1);
      entregaLabel = formatRangoFechas(entregaDate, entregaDate2);
    } else {
      entregaLabel = formatFechaCorta(entregaDate);
    }

    return {
      compraLabel: "Hoy",
      envioLabel: envioLabel,
      entregaLabel: entregaLabel,
      badgeAntes: badgeAntes,
    };
  }

  function formatFechaRelativaOCorta(date, now) {
    var hoy = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var diffDays = Math.round((target.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Mañana";
    return formatFechaCorta(date);
  }

  function formatFechaCorta(date) {
    var meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    var d = date.getDate();
    var m = meses[date.getMonth()];
    return d + " " + m;
  }

  function formatRangoFechas(d1, d2) {
    var meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    var day1 = d1.getDate();
    var day2 = d2.getDate();
    var m1 = meses[d1.getMonth()];
    var m2 = meses[d2.getMonth()];
    if (m1 === m2) {
      return day1 + " y " + day2 + " " + m1;
    }
    return day1 + " " + m1 + " y " + day2 + " " + m2;
  }

  function getEnvioIconoHtml(tipo, kind, colorTexto) {
    if (tipo === "emojis") {
      if (kind === "compra") return '<span style="font-size:24px;line-height:1;">📦</span>';
      if (kind === "envio") return '<span style="font-size:24px;line-height:1;">🚚</span>';
      if (kind === "entrega") return '<span style="font-size:24px;line-height:1;">📍</span>';
    }
    var attrs = 'width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="' + colorTexto + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    if (kind === "compra") {
      return '<svg ' + attrs + '><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>';
    }
    if (kind === "envio") {
      return '<svg ' + attrs + '><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>';
    }
    if (kind === "entrega") {
      return '<svg ' + attrs + '><polyline points="20 6 9 17 4 12"/></svg>';
    }
    return "";
  }

  function buildInformacionEnvioHtml(cfg, info) {
    var borde = cfg.activarBorde ? "1px solid " + cfg.colorTexto + "33" : "none";

    var iconoCompra = getEnvioIconoHtml(cfg.tipoIconos, "compra", cfg.colorTexto);
    var iconoEnvio = getEnvioIconoHtml(cfg.tipoIconos, "envio", cfg.colorTexto);
    var iconoEntrega = getEnvioIconoHtml(cfg.tipoIconos, "entrega", cfg.colorTexto);

    var badgeHtml = "";
    if (info.badgeAntes) {
      var badgeSize = Math.max(9, cfg.tamanoDia - 3);
      badgeHtml = '<span class="' + NS + '-envio-badge-antes" style="background:' + cfg.colorBadgeFondo + ';color:' + cfg.colorBadgeTexto + ';font-size:' + badgeSize + 'px;">' + escapeHtml(info.badgeAntes) + '</span>';
    }

    var sepHtml = '<div class="' + NS + '-envio-sep" style="background:' + cfg.colorTexto + ';"></div>';

    var notaHtml = "";
    if (cfg.mostrarFechasAprox) {
      notaHtml = '<div class="' + NS + '-envio-nota">* Fechas aproximadas</div>';
    }

    return '' +
      '<div class="' + NS + '-envio-wrap">' +
        '<div class="' + NS + '-envio-box" style="background:' + cfg.colorFondo + ';color:' + cfg.colorTexto + ';border-radius:' + cfg.bordesRedondeados + 'px;padding:' + cfg.paddingInterno + 'px;border:' + borde + ';">' +
          '<div class="' + NS + '-envio-col">' +
            '<div class="' + NS + '-envio-col-icon">' + iconoCompra + '</div>' +
            '<div class="' + NS + '-envio-col-label" style="font-size:' + cfg.tamanoLabel + 'px;color:' + cfg.colorTexto + ';">Compra</div>' +
            '<div class="' + NS + '-envio-col-value" style="font-size:' + cfg.tamanoDia + 'px;color:' + cfg.colorTexto + ';">' + escapeHtml(info.compraLabel) + '</div>' +
            badgeHtml +
          '</div>' +
          sepHtml +
          '<div class="' + NS + '-envio-col">' +
            '<div class="' + NS + '-envio-col-icon">' + iconoEnvio + '</div>' +
            '<div class="' + NS + '-envio-col-label" style="font-size:' + cfg.tamanoLabel + 'px;color:' + cfg.colorTexto + ';">Envío</div>' +
            '<div class="' + NS + '-envio-col-value" style="font-size:' + cfg.tamanoDia + 'px;color:' + cfg.colorTexto + ';">' + escapeHtml(info.envioLabel) + '</div>' +
          '</div>' +
          sepHtml +
          '<div class="' + NS + '-envio-col">' +
            '<div class="' + NS + '-envio-col-icon">' + iconoEntrega + '</div>' +
            '<div class="' + NS + '-envio-col-label" style="font-size:' + cfg.tamanoLabel + 'px;color:' + cfg.colorTexto + ';">Entrega</div>' +
            '<div class="' + NS + '-envio-col-value" style="font-size:' + cfg.tamanoDia + 'px;color:' + cfg.colorTexto + ';">' + escapeHtml(info.entregaLabel) + '</div>' +
          '</div>' +
        '</div>' +
        notaHtml +
      '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER MENSAJE DE ALERTA
  ═══════════════════════════════════════════ */
  function renderMensajeAlerta(widget) {
    if (pageType !== "product") return;
    var cfg = normalizeMensajeAlertaConfig(widget.config || {});
    if (!cfg.mensaje || cfg.mensaje.trim() === "") return;
    mountMensajeAlerta(widget, cfg);
  }

  function normalizeMensajeAlertaConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      mensaje: raw.mensaje || "",
      icono: raw.icono || "circulo",
      emojiCustom: raw.emojiCustom || "⭐",
      imagenUrl: raw.imagenUrl || "",
      posicion: raw.posicion === "despues-precio" ? "despues-precio" : "antes-titulo",
      color: raw.color || "verde",
      colorPersonalizadoFondo: raw.colorPersonalizadoFondo || "#6366f1",
      colorPersonalizadoTexto: raw.colorPersonalizadoTexto || "#ffffff",
      tamanoTexto: n(raw.tamanoTexto, 14),
      estiloTexto: raw.estiloTexto === "resaltado" ? "resaltado" : "normal",
      efecto: raw.efecto === "aureola" ? "aureola" : (raw.efecto === "zoom" ? "zoom" : "ninguno"),
      aplicarEfectoA: raw.aplicarEfectoA === "completo" ? "completo" : "icono",
      bordesRedondeados: n(raw.bordesRedondeados, 8),
      paddingInterno: n(raw.paddingInterno, 12),
      mostrarBorde: raw.mostrarBorde === true,
    };
  }

  function getMensajeAlertaColores(cfg) {
    switch (cfg.color) {
      case "verde":
        return { fondo: "#22c55e", texto: "#ffffff", borde: "#15803d" };
      case "rojo":
        return { fondo: "#ef4444", texto: "#ffffff", borde: "#b91c1c" };
      case "amarillo":
        return { fondo: "#f59e0b", texto: "#ffffff", borde: "#b45309" };
      case "personalizado":
      default:
        return {
          fondo: cfg.colorPersonalizadoFondo || "#6366f1",
          texto: cfg.colorPersonalizadoTexto || "#ffffff",
          borde: cfg.colorPersonalizadoFondo || "#6366f1",
        };
    }
  }

  function getMensajeAlertaIconoHtml(cfg, colores) {
    var iconoSize = Math.round((cfg.tamanoTexto || 14) * 1.4);
    switch (cfg.icono) {
      case "circulo": {
        var dotColor = cfg.color === "amarillo" ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.85)";
        var dotSize = Math.max(10, Math.round(iconoSize * 0.55));
        return '<span class="' + NS + '-alerta-icono" style="width:' + iconoSize + 'px;height:' + iconoSize + 'px;">' +
          '<span style="display:inline-block;width:' + dotSize + 'px;height:' + dotSize + 'px;border-radius:50%;background:' + dotColor + ';"></span>' +
        '</span>';
      }
      case "corazon":
        return '<span class="' + NS + '-alerta-icono" style="font-size:' + iconoSize + 'px;">❤️</span>';
      case "alerta":
        return '<span class="' + NS + '-alerta-icono" style="font-size:' + iconoSize + 'px;">⚠️</span>';
      case "emoji":
        return '<span class="' + NS + '-alerta-icono" style="font-size:' + iconoSize + 'px;">' + escapeHtml(cfg.emojiCustom || "⭐") + '</span>';
      case "imagen":
        if (cfg.imagenUrl && cfg.imagenUrl.trim() !== "") {
          return '<span class="' + NS + '-alerta-icono"><img src="' + escapeHtml(cfg.imagenUrl) + '" alt="" style="width:' + iconoSize + 'px;height:' + iconoSize + 'px;object-fit:contain;display:block;" /></span>';
        }
        return "";
      case "nada":
      default:
        return "";
    }
  }

  function mountMensajeAlerta(widget, cfg) {
    var uniqueId = NS + "-alerta-" + widget.id;
    if (qs("#" + uniqueId)) return;

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    if (cfg.posicion === "despues-precio") {
      var priceTarget = findProductPriceTarget();
      if (priceTarget && priceTarget.parentNode) {
        priceTarget.parentNode.insertBefore(container, priceTarget.nextSibling);
      } else {
        var fallbackTarget = findProductTarget("before-button");
        if (!fallbackTarget) return;
        fallbackTarget.node.parentNode.insertBefore(container, fallbackTarget.node);
      }
    } else {
      var titleSelectors = ['h1.product-name', 'h1[itemprop="name"]', '.product-name', '.js-product-name', '.product-title', 'h1'];
      var titleEl = null;
      for (var i = 0; i < titleSelectors.length; i++) {
        titleEl = qs(titleSelectors[i]);
        if (titleEl) break;
      }
      if (titleEl && titleEl.parentNode) {
        titleEl.parentNode.insertBefore(container, titleEl);
      } else {
        var fallbackTarget2 = findProductTarget("before-button");
        if (!fallbackTarget2) return;
        fallbackTarget2.node.parentNode.insertBefore(container, fallbackTarget2.node);
      }
    }

    container.innerHTML = buildMensajeAlertaHtml(cfg);
    console.log("[Nevux] Mensaje alerta montado");
  }

  function buildMensajeAlertaHtml(cfg) {
    var colores = getMensajeAlertaColores(cfg);
    var iconoHtml = getMensajeAlertaIconoHtml(cfg, colores);

    var fontWeight = cfg.estiloTexto === "resaltado" ? 700 : 500;
    var borde = cfg.mostrarBorde ? "2px solid " + colores.borde : "none";

    var efectoAnim =
      cfg.efecto === "aureola" ? NS + "-aureolaPulse 2s ease-in-out infinite" :
      cfg.efecto === "zoom" ? NS + "-zoomEffect 2s ease-in-out infinite" :
      "none";

    var aplicarACompleto = cfg.aplicarEfectoA === "completo";
    var animacionBox = aplicarACompleto ? efectoAnim : "none";
    var animacionIcono = !aplicarACompleto ? efectoAnim : "none";

    var iconoFinal = iconoHtml;
    if (iconoHtml && animacionIcono !== "none") {
      iconoFinal = '<span style="display:inline-flex;animation:' + animacionIcono + ';">' + iconoHtml + '</span>';
    }

    return '' +
      '<div class="' + NS + '-alerta-box" style="' +
        'background:' + colores.fondo + ';' +
        'color:' + colores.texto + ';' +
        'border-radius:' + cfg.bordesRedondeados + 'px;' +
        'padding:' + cfg.paddingInterno + 'px ' + (cfg.paddingInterno + 6) + 'px;' +
        'border:' + borde + ';' +
        'animation:' + animacionBox + ';' +
        'width:100%;box-sizing:border-box;' +
      '">' +
        (iconoFinal ? iconoFinal : "") +
        '<span class="' + NS + '-alerta-texto" style="' +
          'font-size:' + cfg.tamanoTexto + 'px;' +
          'font-weight:' + fontWeight + ';' +
          'color:' + colores.texto + ';' +
        '">' + escapeHtml(cfg.mensaje) + '</span>' +
      '</div>';
  }

  /* ═══════════════════════════════════════════
     RENDER MENSAJE DE GARANTÍA
  ═══════════════════════════════════════════ */
  function renderMensajeGarantia(widget) {
    if (pageType !== "product") return;
    var cfg = normalizeMensajeGarantiaConfig(widget.config || {});
    // Si no hay ni título ni texto ni imagen, no mostramos nada
    var tieneAlgo =
      (cfg.titulo && cfg.titulo.trim() !== "") ||
      (cfg.texto && cfg.texto.trim() !== "") ||
      (cfg.imagenBase64 && cfg.imagenBase64.trim() !== "");
    if (!tieneAlgo) return;
    mountMensajeGarantia(widget, cfg);
  }

  function normalizeMensajeGarantiaConfig(raw) {
    function n(v, fb) {
      if (v === undefined || v === null || v === "") return fb;
      var p = typeof v === "string" ? parseInt(v, 10) : v;
      return isNaN(p) ? fb : p;
    }
    return {
      titulo: raw.titulo || "",
      texto: raw.texto || "",
      imagenBase64: raw.imagenBase64 || "",
      colorFondo: raw.colorFondo || "#fff9f3",
      colorTitulo: raw.colorTitulo || "#000000",
      colorTexto: raw.colorTexto || "#333333",
      colorBorde: raw.colorBorde || "#e7decf",
      tamanoTitulo: raw.tamanoTitulo || "16px",
      tamanoTexto: raw.tamanoTexto || "16px",
      bordesRedondeados: n(raw.bordesRedondeados, 5),
      paddingInterno: n(raw.paddingInterno, 20),
    };
  }

  /**
   * Parsea texto con marcadores markdown-style a HTML seguro.
   * - **texto**  → <strong>
   * - *texto*    → <em>
   * - __texto__  → <u>
   * - líneas "- item" consecutivas → <ul><li>
   * Escapa HTML primero (anti-XSS).
   */
  function parseTextoMarkdownGarantia(texto) {
    if (!texto) return "";

    // 1) Escapar HTML
    var out = escapeHtml(texto);

    // 2) Detectar bloques de lista (líneas que empiezan con "- ")
    var lineas = out.split("\n");
    var bloques = [];
    var bufferLista = [];

    function flushLista() {
      if (bufferLista.length > 0) {
        var items = "";
        for (var k = 0; k < bufferLista.length; k++) {
          items += "<li>" + bufferLista[k] + "</li>";
        }
        bloques.push("<ul>" + items + "</ul>");
        bufferLista = [];
      }
    }

    for (var i = 0; i < lineas.length; i++) {
      var linea = lineas[i];
      var trimmed = linea.trim();
      if (trimmed.indexOf("- ") === 0) {
        bufferLista.push(trimmed.substring(2));
      } else {
        flushLista();
        bloques.push(linea);
      }
    }
    flushLista();

    out = bloques.join("\n");

    // 3) Aplicar formatos (orden importa: ** antes que *, __ antes de _)
    out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/__(.+?)__/g, "<u>$1</u>");
    out = out.replace(/\*(.+?)\*/g, "<em>$1</em>");

    // 4) Saltos de línea → <br>
    out = out.replace(/\n/g, "<br/>");

    // 5) Limpiar <br> pegados a <ul>/</ul>
    out = out.replace(/<br\/>\s*<ul/g, "<ul");
    out = out.replace(/<\/ul>\s*<br\/>/g, "</ul>");

    return out;
  }

  function mountMensajeGarantia(widget, cfg) {
    var uniqueId = NS + "-garantia-" + widget.id;
    if (qs("#" + uniqueId)) return;

    var target = findProductTarget("before-button");
    if (!target) {
      console.warn("[Nevux] No se encontró target para mensaje garantía en producto");
      return;
    }

    var container = document.createElement("div");
    container.id = uniqueId;
    container.className = NS + "-root";

    // Se ubica DESPUÉS del botón/formulario "Agregar al carrito"
    if (target.node.parentNode) {
      target.node.parentNode.insertBefore(container, target.node.nextSibling);
    } else {
      return;
    }

    container.innerHTML = buildMensajeGarantiaHtml(cfg);
    console.log("[Nevux] Mensaje garantía montado");
  }

  function buildMensajeGarantiaHtml(cfg) {
    var tieneImagen = cfg.imagenBase64 && cfg.imagenBase64.trim() !== "";
    var tieneTitulo = cfg.titulo && cfg.titulo.trim() !== "";
    var tieneTexto = cfg.texto && cfg.texto.trim() !== "";

    var imgHtml = "";
    if (tieneImagen) {
      imgHtml = '<div class="' + NS + '-garantia-img-wrap">' +
        '<img src="' + cfg.imagenBase64 + '" alt="" />' +
      '</div>';
    }

    var tituloHtml = "";
    if (tieneTitulo) {
      tituloHtml = '<div class="' + NS + '-garantia-titulo" style="' +
        'font-size:' + cfg.tamanoTitulo + ';' +
        'color:' + cfg.colorTitulo + ';' +
        (tieneTexto ? '' : 'margin-bottom:0;') +
      '">' + escapeHtml(cfg.titulo) + '</div>';
    }

    var textoHtml = "";
    if (tieneTexto) {
      var textoParseado = parseTextoMarkdownGarantia(cfg.texto);
      textoHtml = '<div class="' + NS + '-garantia-texto" style="' +
        'font-size:' + cfg.tamanoTexto + ';' +
        'color:' + cfg.colorTexto + ';' +
      '">' + textoParseado + '</div>';
    }

    return '' +
      '<div class="' + NS + '-garantia-box" style="' +
        'background:' + cfg.colorFondo + ';' +
        'border:1px solid ' + cfg.colorBorde + ';' +
        'border-radius:' + cfg.bordesRedondeados + 'px;' +
        'padding:' + cfg.paddingInterno + 'px;' +
      '">' +
        imgHtml +
        '<div class="' + NS + '-garantia-content">' +
          tituloHtml +
          textoHtml +
        '</div>' +
      '</div>';
  }

})();
